import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [{
      path: '/',
      name: 'home',
      meta: {
        index: 0,
      },
      component: () => import ('./views/Home.vue')
    },
  ],
})