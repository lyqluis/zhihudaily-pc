<template>
  <div class="article-list">
    <!-- 轮播页 -->
    <slide @openArticle="openArticle"/>
    <!-- 列表 -->
    <div
      class="list-wrapper"
      v-infinite-scroll="loadmore"
      infinite-scroll-disabled="loading"
      infinite-scroll-distance="10"
    >
      <div class="oneday-wrapper" v-for="(item,index) in stories" :key="index">
        <div class="date">{{adjustDate(item.date)}}</div>
        <ul class="list">
          <li
            v-for="(news,index) in item.stories"
            :key="index"
            @click="openArticle(news.id)"
            :class="news.id==nowArticle ? 'active' : ''"
          >
            <div class="border">
              <div>{{news.title}}</div>
              <img v-lazy="replaceUrl(news.images[0])" :alt="news.title">
            </div>
          </li>
        </ul>
      </div>

      <!-- 加载项 -->
      <div class="loading" v-show="loading">
        <i class="el-icon-loading"/>
      </div>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import api from "../assets/js/api";
import Headmenu from "@/components/Headmenu";
import Slide from "@/components/Slide";

export default {
  name: "articleList",
  components: {
    Headmenu,
    Slide
  },
  props: {
    nowArticle: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      stories: [],
      date: "",
      loading: false,
      dateRange: []
    };
  },
  created() {
    this.getLatestData();
  },
  methods: {
    //最新列表数据
    getLatestData() {
      this.$axios(api.newsLatest).then(res => {
        console.log(res);
        this.stories.push(res.data);
        // this.getidList(res.data.stories);
        this.date = res.data.date;
        this.today = res.data.date;
        this.getIdList(res.data.stories);
      });
    },
    //获取之前文章列表数据
    getBeforeData(daterange) {
      if (daterange) {
      }
      this.$axios(api.newsBefore + this.date).then(res => {
        if (!res.data.status) {
          this.date = res.data.date;
          this.stories.push(res.data);
          this.getIdList(res.data.stories);
        }
      });
    },
    //加载更多
    loadmore() {
      if (this.dateRange && this.date == this.dateRange[0]) {
        this.loading = false;
        return;
      }
      if (!this.loading) {
        this.loading = true;
        setTimeout(() => {
          this.getBeforeData();
          this.loading = false;
        }, 2000);
      }
    },
    //按时间查找
    getTimeData(daterange) {
      if (!daterange.length) {
        this.dateRange = [];
        this.getLatestData();
      }
      this.date = daterange[1];
      this.dateRange = daterange;
      this.stories = [];
      this.loadmore();
    },
    //显示列表时间栏
    adjustDate(date){
      if(this.today == date) return 'Today'
      let y = date.substr(0,4) + '年';
      let m = date.substr(4,2) + '月';
      let d = date.substr(6,2) + '日';
      return y + m + d
    },
    //替换图片
    replaceUrl(oldurl) {
      return oldurl.replace(
        /http\w{0,1}:\/\/p/g,
        "https://images.weserv.nl/?url=p"
      );
    },
    //打开文章 -> 传入首页
    openArticle(id) {
      this.$emit("openArticle", id);
    },
    //获取idlist
    getIdList(list) {
      let arr = [];
      list.forEach(el => {
        arr.push(el.id);
      });
      this.$emit("getIdList", arr);
    }
  }
};
</script>

<style lang="stylus" scoped>
@import '../assets/stylus/mixin.styl'

.article-list
  background: #fff
  font-size: pr(10)

  .list-wrapper
    div.oneday-wrapper
      .date
        display: flex
        justify-content: center
        align-items: center
        background: rgb(0, 157, 243)
        width: 100%
        height: pr(20)
        text-align: center
        color: rgb(255, 255, 255)
        // font-size: pr(16)
        font-weight: 600
        padding: 0

      ul.list
        // padding: 0
        &>li
          padding: 0 pr(15)
          line-height: pr(16)

          .border
            padding: pr(10) 0
            width: 100%
            // height: 100%
            display: flex
            justify-content: space-between
            align-items: center
            border-bottom: pr(1) solid rgba(2, 2, 2, 0.1)

            &>div
              margin-right: pr(10)

            &>img
              flex: none
              width: pr(50)
              height: pr(50)

          &:last-child .border
            border: none

          &:hover
            background: rgba(100, 100, 100, 0.1)
            cursor: pointer

        .active
          background: rgba(100, 100, 100, 0.2)

        .active:hover
          background: rgba(100, 100, 100, 0.2)

    .loading
      height: pr(20)
      padding: pr(5)
      display: flex
      justify-content: center
      align-items: center

      &>i
        font-size: pr(10)
        margin: 0 auto
</style>
