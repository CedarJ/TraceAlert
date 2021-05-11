import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

let store = new Vuex.Store({
  state: {
    user: {},
    token: null
  },

  getters: {
    user: (state) => {
      return state.user
    },
    token: (state) => {
      return state.token
    }
  },
  mutations: {
    setUser: (state, user) => {
      state.user = user
    },
    setToken: (state, token) => {
      state.token = token
    }
  }
})

export default store
