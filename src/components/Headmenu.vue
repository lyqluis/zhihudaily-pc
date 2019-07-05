<template>
  <div class="head-menu">
    <div class="logo">
      <i class="zhihu"></i>
      <span class>知乎日报</span>
    </div>
    <div class="search">
      <el-date-picker
        v-model="timeRange"
        type="daterange"
        align="right"
        value-format
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        :picker-options="pickerOptions"
        @change="handleDate"
      />
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      pickerOptions: {
        shortcuts: [
          {
            text: "最近一周",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近一个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近三个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit("pick", [start, end]);
            }
          }
        ]
      },
      timeRange: ""
    };
  },
  methods: {
    handleDate($event) {
      let arr = [];
      if ($event) {
        $event.forEach((el, i) => {
          let t = new Date();
          t.setTime(el.getTime() + 3600 * 1000 * 24 * i);
          let y = t.getFullYear() + "";
          let m = t.getMonth() + 1 + "";
          let d = t.getDate() + "";
          m = m.length == 1 ? "0" + m : m;
          d = d.length == 1 ? "0" + d : d;
          arr.push(y + m + d);
        });
      }
      // this.$store.commit("GET_DATE", arr);
      this.$emit("handleDate", arr);
    }
  }
};
</script>

<style lang="stylus" scoped>
@import '../assets/stylus/mixin.styl'

.head-menu
  width: 100%
  height: 60px
  color: rgb(255, 255, 255)
  // position: absolute
  display: flex
  // justify-content: space-between
  padding: 0 pr(10)
  background: rgb(0, 157, 218)
  line-height: 60px

  .logo
    display: flex
    align-items: center

    &>i.zhihu
      display: inline-block
      width: 60px
      height: 60px
      background: lightyellow
      background: url('../assets/img/logo.jpg') center
      background-size: 100%

    &>span
      // position: absolute
      display: inline-block
      // width: 100vw
      // top: 0
      // left: 0
      font-size: 37px
      font-weight: 400
      text-align: center

  .search
    // background: black
    margin-left: 50px
    display: flex
    justify-content: center
    align-items: center

    &>>>.el-date-editor .el-range-separator
      padding: 0
</style>

<style lang="stylus">
// .search .el-date-editor,
// .search .el-range-editor,
// .search .el-input__inner,
// .search .el-date-editor--daterange
//   top -50px
//   // position absolute
</style>
