import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from "vuex-persistedstate"
import mutations from './mutations'
import getters from './getters'

Vue.use(Vuex)

const state = {
  socketId: '',
  user: {
    name: '',
    avatar: '',
    desc: '',
    id: ''
  }
}

export default new Vuex.Store({
  state,
  mutations,
  getters,
  plugins: [createPersistedState({
    storage: window.sessionStorage
  })]
})