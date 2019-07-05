import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)


export default new Vuex.Store({
  state: {
    idList: [], // articlelist的id顺序
    nowId: 0, //article id
    dateRange: [],
  },
  mutations: {
    GET_ID_LIST(state, list) {
      state.idList = [...state.idList, ...list];
    },
    CLEAR_ID_LIST(state, list) {
      state.idList = list;
    },
    GET_ID(state, newid) {
      state.nowId = newid;
    },
    next2now(state) {
      state.nowId = state.idList[state.idList.indexOf(state.nowId) + 1];
    },
    GET_DATE(state, dateArr) {
      state.dateRange = dateArr;
      // console.log(state.commentNum)
    }

  },
  actions: {
    // replaceUrl(oldurl) {
    //   // console.log(oldurl);
    //   return oldurl.replace(
    //     /http\w{0,1}:\/\/p/g,
    //     "https://images.weserv.nl/?url=p"
    //   );
    // },
    // getId(state,newid){
    //   state.nowId = newid;
    // },

  }
})