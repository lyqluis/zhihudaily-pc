<template>
  <div class="swiper-container">
    <div class="swiper-wrapper">
      <!-- 插槽 -->
      <!-- <slot></slot> -->
      <div v-for="item in pics" :key="item.id" class="swiper-slide" @click="openArticle(item.id)">
        <img :src="replaceUrl(item.image)">
        <div class="shadow"/>
        <span class="title">{{item.title}}</span>
      </div>
    </div>
    <div class="swiper-pagination"></div>
  </div>
</template>

<script>
import Swiper from "swiper";
import "swiper/dist/css/swiper.min.css";
import api from "../assets/js/api";
import Vue from "vue";

export default {
  components: {
    Swiper
  },
  data() {
    return {
      pics: []
    };
  },
  created() {
    this.getData();
  },
  computed: {},
  methods: {
    //获取轮播热门文章信息
    getData() {
      this.$axios(api.newsLatest)
        .then(res => {
          this.pics = res.data.top_stories;
        })
        .then(() => {
          Vue.nextTick(() => {
            this.initSwiper();
          });
        });
      // .catch((error) => {
      //   // handle error
      //   console.log(error);
      // });
    },
    //关于图片盗链问题的, 替换原有的url
    replaceUrl(oldurl) {
      // console.log(oldurl);
      return oldurl.replace(
        /http\w{0,1}:\/\/p/g,
        "https://images.weserv.nl/?url=p"
      );
    },
    initSwiper() {
      let swiper = new Swiper(".swiper-container", {
        // direction: "vertical", // 垂直切换选项
        loop: true, // 循环模式选项
        autoplay: {
          delay: 5000,
          stopOnLastSlide: false,
          disableOnInteraction: true
        }, //自动切换
        observer: true, //添加后解决vue中不自动轮播的问题
        observeParents: true, //同上
        // 如果需要分页器
        pagination: {
          el: ".swiper-pagination"
        },
        // // 如果需要前进后退按钮
        // navigation: {
        //   nextEl: ".swiper-button-next",
        //   prevEl: ".swiper-button-prev"
        // },
        // 如果需要滚动条
        scrollbar: {
          el: ".swiper-scrollbar"
        }
      });
    },
    openArticle(id) {
      //取得现在的id以及下一个id
      this.$store.commit("getId", id);
      this.$emit('openArticle', id);
    }
  }
};
</script>

<style lang="stylus" scoped>
@import '../assets/stylus/mixin.styl'

.swiper-container
  height: pr(120)
  overflow: hidden

  .swiper-wrapper
    img
      width: 100%
      position: relative
      top: pr(-60)
      /* margin-top: -15%; */

    .title
      display: block
      position: absolute
      bottom: pr(10)
      color: rgb(255, 255, 255)
      font-size: pr(11)
      font-weight: 900
      padding: 0 pr(15)
      text-shadow: 0 pr(2) pr(2) rgb(2, 2, 2)
      line-height: pr(14)

    .shadow
      height: 100%
      width: 100%
      position: absolute
      bottom 0
      background: linear-gradient(0deg, rgba(0, 0, 0, 0.5) 20%, rgba(0, 0, 0, 0))

  &>>>.swiper-pagination
    position: absolute
    bottom: pr(2)
</style>