<template>
  <div id="app">
    <div class="view-wrapper">
      <router-view/>
    </div>
  </div>
</template>

<script>
export default {
  name: "app",
  data() {
    return {};
  },
  components: {},
  watch: {},
  methods: {}
};
</script>

<style lang="stylus" scoped>
#app
  min-width: 1024px
</style>