import Vue from 'vue'
import Vuex from 'vuex'
import { setItem, getItem } from '@/utils/storage' /* 按需 引入封装的获取本地数据的 函数api */
Vue.use(Vuex)

const TOKEN_KEY = 'USER_TOKEN'

export default new Vuex.Store({
  state: {
    // user: null
    // 获取本地的数据
    // user: JSON.parse(localStorage.getItem(TOKEN_KEY))
    user: getItem(TOKEN_KEY),
    mama: '垃圾东西'
  },
  getters: {
  },
  mutations: {
    getUser (state, data) {
      state.user = data/* 我竟然因为一个逗号,唉~~~ */
      // 保存本地的数据
      // localStorage.setItem(TOKEN_KEY, JSON.stringify(state.user))
      setItem(TOKEN_KEY, JSON.stringify(state.user))
    }
  },
  actions: {
  },
  modules: {
  }
})
