import Vue from 'vue'
import VueSocketio from 'vue-socket.io';
import store from './store'
import router from './route'
import VueRouter from 'vue-router'
import App from './App.vue'
import axios from './axios'

import iView from 'iview';
import 'iview/dist/styles/iview.css';

Vue.use(VueRouter)
Vue.use(iView);

Vue.config.productionTip = false
Vue.prototype.$api = axios

router.beforeEach((to, from, next) => {
  if(to.fullPath === '/' && !store.state.user.id) {
    next('/login')
  } else {
    next()
  }
})

Vue.use(new VueSocketio({
  debug: true,
  connection: 'localhost:3000',
  vuex: {
    store
  },
  options: {
    path: '/socket/'
  }
}))

new Vue({
  render: h => h(App),
  router,
  store,
}).$mount('#app')
