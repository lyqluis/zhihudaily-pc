<template>
  <div class="comments">
    <!-- <header>
      <span>{{commentNum}}条点评</span>
    </header> -->
    <long-comment :longComments="commentData.shortComments"/>
    <short-comment :shortComments="commentData.longComments"/>
    <!-- <footer>
      <span class="icon-back" @click="goback"/>
      <span class="writeboard" @click="openWriteboard">
        <i class="writeboard"/>
        写点评
      </span>
    </footer>-->
  </div>
</template>

<script>
import LongComment from "../components/LongComment";
import ShortComment from "../components/ShortComment";

export default {
  components: {
    LongComment,
    ShortComment
  },
  props: {
    commentData: {
      type: Object,
      required: true
    }
  },
  data() {
    return {};
  },
  created() {},
  computed: {
    commentNum() {
      return (
        this.commentData.shortComments.length +
        this.commentData.longComments.length
      );
    }
  },
  methods: {}
};
</script>

<style lang="stylus" scoped>
@import '../assets/stylus/mixin.styl'

.comments
  width: 100%
  font-size: pr(10)
  padding-bottom: pr(30)

  header
    background: rgb(0, 160, 239)
    color: aliceblue
    height: pr(30)
    padding: 0 pr(15)

    &>span
      display: inline-block
      width: 100%
      font-weight: 900
      text-align: center
      line-height: pr(30)

</style>