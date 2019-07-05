<template>
  <div class="home">
    <header>
      <headmenu @handleDate="handleDate"/>
    </header>
    <div class="main">
      <div class="list center" ref="articlelist">
        <articlelist ref="list" @getIdList="getIdList" @openArticle="openArticle" :nowArticle="nowArticle"/>
      </div>
      <div class="right-wrapper" ref="rightwrapper" v-if="showArticle">
        <div class="article-wrapper" ref="article" v-loading="loading">
          <header v-if="articleData.type === 0">
            <img
              v-if="articleData.image"
              @load="loadImg"
              :src="replaceUrl(articleData.image)"
              :alt="articleData.image_source"
            >
            <div class="layer"></div>
            <span class="title title-postion">{{articleData.title}}</span>
            <span class="source">图片：{{articleData.image_source}}</span>
          </header>
          <div class="article-body" v-html="articleData.body"/>
        </div>
        <div class="comment-wrapper" ref="comment" v-show="showComment">
          <comments :commentData="commentData"/>
        </div>
        <div class="bottom-bar">
          <span class="icon-back up" @click="nextArticle(-1)" />
          <span class="icon-next" @click="nextArticle(1)" />
          <span class="icon-good">
            <span class="top-num">{{extraData.popularity}}</span>
          </span>
          <span
            class="icon-comment"
            @click="handleComment"
            :style="showComment ? 'color: rgb(0, 160, 239)' : '' "
          >
            <span class="top-num">{{extraData.comments}}</span>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Indicator } from "mint-ui";
import api from "../assets/js/api";
import Headmenu from "@/components/Headmenu.vue";
import Articlelist from "./Articlelist";
import Comments from "./Comments";

export default {
  name: "home",
  components: {
    Articlelist,
    Comments,
    Headmenu
  },
  data() {
    return {
      loading:false,
      showArticle: false,
      showComment: false,
      nowArticle: 0,
      articleData: {},
      extraData: {},
      commentData: {
        longComments: [],
        shortComments: []
      },
      articleList:[]
    };
  },
  created() {
  },
  methods: {
    // 打开文章
    openArticle(id) {
      // console.log(id);
      this.loading = true;
      if (id) {
        let list = this.$refs.articlelist;
        let article = this.$refs.article;
        //移动side
        list.className = "list side-animate";
        this.showArticle = true;
        this.getArticle(id);
        this.$store.commit("GET_ID", id); //store存储当前文章id
        if (article) article.scrollTop = 0; //滚动条top
        // console.log(this.commentData);
      }
    },
    //获取文章
    getArticle(id) {
      this.nowArticle = id;
      //获取文章
      this.$axios(api.news + id).then(res => {
        this.articleData = res.data;
        this.articleData.body = this.replaceUrl(this.articleData.body);
        //去掉原来图片占位<div>
        this.articleData.body = this.articleData.body.replace(
          /<div class="img-place-holder"><\/div>/g,
          ""
        );
      });
      //获取评论
      this.$axios(api.storyExtra + id).then(res => {
        this.extraData = res.data;
      });
      //获取短评
      this.$axios(api.story + id + "/short-comments").then(res => {
        this.commentData.shortComments = res.data.comments;
      });
      //获取长评
      this.$axios(api.story + id + "/long-comments").then(res => {
        this.commentData.longComments = res.data.comments;
      });
    },
    replaceUrl(oldurl) {
      // console.log(oldurl);
      return oldurl.replace(
        /http\w{0,1}:\/\/p/g,
        "https://images.weserv.nl/?url=p"
      );
    },
    replaceBodyUrl(oldurl) {
      // console.log(oldurl);
      return oldurl.replace(
        /src="http\w{0,1}:\/\/p/g,
        "https://images.weserv.nl/?url=p"
      );
    },
    //打开评论
    handleComment() {
      this.showComment = !this.showComment;
      //关闭
      if (!this.showComment) {
        this.closeArticle();
        return;
      }
      let comment = this.$refs.comment;
      let article = this.$refs.article;
      let leftDis = -article.offsetLeft + "px";
      let articleWidth = article.offsetWidth;
      // 打开
      article.style.transform = "translate(" + leftDis + ")";
      //延迟触发comment动画，因为comment从 display:none -> block
      setTimeout(() => {
        comment.style.opacity = 1;
        comment.style.right = 0;
      }, 50);
      //固定位置，防止因窗口变化而引起位置偏移
      setTimeout(() => {
        article.style.left = article.offsetLeft + "px";
      }, 1000);
    },
    //关闭评论
    closeArticle() {
      let rightwrapper = this.$refs.rightwrapper;
      let comment = this.$refs.comment;
      let article = this.$refs.article;
      let articleWidth = article.offsetWidth;
      let leftDis = (rightwrapper.offsetWidth - articleWidth) / 2;
      setTimeout(() => {
        article.style.left = article.offsetLeft + leftDis + "px";
        comment.style.opacity = 0;
        comment.style.right = "-10%";
      });
    },
    //按时间查找
    handleDate(daterange) {
      console.log(daterange);
      this.$refs.list.getTimeData(daterange);
    },
    //图片加载
    loadImg(){
      this.loading = false;
    },
    //从上一篇到下一篇
    getIdList(arr){
      this.articleList = [...this.articleList, ...arr];
    },
    nextArticle(to){
      let i = this.articleList.indexOf(this.nowArticle);
      if(!i && to < 0) return
      if(i == this.articleList.length && to > 0) return
      this.openArticle(this.articleList[i+to]);
    }
  }
};
</script>


<style lang="stylus" scoped>
@import '../../node_modules/mint-ui/lib/spinner/style.css'
@import '../../node_modules/mint-ui/lib/indicator/style.css'
@import '../../node_modules/mint-ui/lib/popup/style.css'
@import '../assets/stylus/mixin.styl'

.home
  header
    width: 100%
    height: 60px
    background: lightgreen
    position: fixed
    top: 0
    z-index: 50
    box-shadow: 2px 0px 5px rgba(26, 26, 26, 1)

  .main
    margin-top: 60px
    font-size: pr(10)
    background: rgb(246, 246, 246)
    display: flex
    height: calc(100vh - 60px)
    position: relative

    .list
      position: absolute
      height: 100%
      width: 30%
      min-width: pr(200)
      overflow: scroll
      left: 50%
      transform: translate(-50%)
      box-shadow: 0 2px 5px rgba(26, 26, 26, 1)
      z-index: 20

    .side-animate
      // -webkit-animation: 1s ease 0s 1 side_move
      animation: 0.5s ease-in-out 0s 1 forwards side_move

    .right-wrapper
      flex: none
      position: absolute
      width: 70%
      height: 100%
      animation: article-animate 0.5s ease-in-out 0s 1 forwards
      overflow: auto
      overflow-x: hidden
      display: flex
      justify-content: center

      // padding: 0 pr(50)
      // transition padding 1s ease
      .article-wrapper
        z-index: 10
        width: 60%
        height: 100%
        position: absolute
        overflow: auto
        overflow-x: hidden
        box-shadow: 0 2px 5px rgba(50, 50, 50, 0.7)
        transition: all 0.5s linear 0s
        background: white

        // display: none
        &>header
          width: 100%
          min-width: 300px
          // margin: 0 auto
          height: pr(120)
          overflow: hidden
          position: relative

          &>img
            width: 100%
            position: relative
            bottom: 50%

          .layer
            width: 100%
            height: 100%
            background: linear-gradient(
              to top,
              rgba(0, 0, 0, 0.7),
              rgba(255, 255, 255, 0.2)
            )
            position: absolute
            top: 0

          &>span
            padding-left: pr(5)
            padding-right: pr(5)

          .title-postion
            display: block
            width: 100%
            position: absolute
            bottom: 10%

          .title
            color: rgb(255, 255, 255)
            font-size: pr(12)
            font-weight: bolder
            padding: pr(10)
            text-shadow: 0px pr(2) pr(2) rgb(2, 2, 2)
            line-height: pr(15)

          .source
            z-index: 10
            display: block
            width: 100%
            position: absolute
            bottom: pr(10)
            font-size: pr(7)
            text-align: right
            padding-right: pr(10)
            color: rgba(200, 200, 200, 1)

        .article-body
          padding-bottom: pr(30)

        &::-webkit-scrollbar
          width: 0 !important

      .bottom-bar
        z-index: 15
        width: 100%
        background: rgba(253, 253, 253, 1)
        border-top: rgba
        position: fixed
        bottom: 0
        left: 0
        height: pr(30)
        box-shadow: 0 2px 5px rgba(0, 0, 0, 1)
        border-left: rgba(246, 246, 246, 1) pr(1) solid
        display: flex
        justify-content: space-around
        align-items: center
        padding: 0 pr(50)
        font-size: 30px
        color: rgb(160, 160, 160)

        &>span
          display: inline-block
          position: relative

          &:hover
            color: rgb(34, 140, 255)
        & .up
          transform rotate(90deg)

        .top-num
          display: inline-block
          position: absolute
          right: pr(-5)
          top: pr(-3)
          font-size: pr(8)
          text-align: center

        .icon-comment span
          color: white
          background: rgb(34, 140, 255)
          width: pr(15)
          height: pr(10)
          line-height: pr(10)

      .comment-wrapper
        opacity: 1
        z-index: 9
        width: 41%
        height: 100%
        right: -10%
        position: absolute
        overflow: auto
        transition: all 0.25s linear 0s
        // transition: opacity  5s linear 0s
        // padding-right 1%
        // position absolute

      .comment-animate
        opacity: 1
        // animation comment-animate 2s ease-in-out 0s 1 forwards

  @keyframes side_move
    0
      transform: scale(1) translate(-50%)
      left: 50%

    5%
      transform: scale(0.9) translate(-50%)
      left: 50%

    95%
      transform: scale(0.9)
      left: 0

    100%
      transform: scale(1)
      left: 0

  @keyframes article-animate
    0
      transform: scale(0.2)
      left: 50%
      opacity: 0

    5%
      transform: scale(0.3)
      left: 50%
      opacity: 0.5

    95%
      transform: scale(0.9)
      right: 0
      opacity: 0.5

    100%
      transform: scale(1)
      right: 0
      opacity: 1
</style>