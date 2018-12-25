import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/Login'
import Home from '@/components/Home'
import User from '@/components/User'
import Rights from '@/components/Rights'
import Roles from '@/components/Roles'
import axios from 'axios'

Vue.use(Router)
Vue.prototype.axios = axios
axios.defaults.baseURL = 'http://localhost:8888/api/private/v1/'
const router = new Router({
  routes: [
    {
      path: '/',
      component: Login
    },
    {
      path: '/Login',
      component: Login
    },
    {
      path: '/Home',
      component: Home,
      children: [
        {
          path: '/user',
          component: User
        },
        {
          path: '/rights',
          component: Rights
        },
        {
          path: '/roles',
          component: Roles
        }
      ]
    }
  ]
})
// beforeEach全局导航守卫，路由状态发生改变都会经过它
router.beforeEach((to, from, next) => {
  // 如果去首页 直接放行
  if (to.path === '/Login') {
    next()
    return
  }
  let shopToken = localStorage.getItem('shopToken')
  // 如果有token说明登录过，否则没登录过去登陆
  if (shopToken) {
    next()
  } else {
    next('/Login')
  }
})
export default router
