import VueRouter from 'vue-router'

import Index from '../views'
import Login from '../views/login'
import Register from '../views/register'

const routes = [
  {
    path: '/',
    component: Index
  },
  {
    path: '/login',
    component: Login
  },
  {
    path: '/register',
    component: Register
  }
]
const router = new VueRouter({routes})

export default router