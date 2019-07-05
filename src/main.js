import Vue from 'vue'
import App from './App.vue'
import router from './router'
import axios from 'axios'
import store from './store'
import {
  InfiniteScroll,
  Lazyload,
} from "mint-ui";

import './assets/stylus/index.styl'
import './assets/js/rem.js'
import 'element-ui/lib/theme-chalk/icon.css'
import { DatePicker, Loading } from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css'

Vue.config.productionTip = false

Vue.use(InfiniteScroll);
Vue.use(Lazyload);
Vue.use(DatePicker);
Vue.use(Loading.directive);

//  全局使用 axios
Vue.prototype.$axios = axios;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')