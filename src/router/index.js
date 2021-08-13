import Vue from 'vue'
import Router from 'vue-router'
import login from '@/components/login'
import home from '@/components/Home'
import Welcome from '@/components/Welcome'
import Users from '@/components/user/Users'

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/login',
      component: login
    },
    {
      path: '/home',
      component: home,
      redirect: '/welcome',
      children: [{
        path: '/welcome',
        component: Welcome
      }, {
        path: '/users',
        component: Users
      }]
    }
  ]
})

// 挂载路由导航守卫
router.beforeEach((to, from, next) => {
// to将要访问的路径
// from代表从那个路径跳转
// next放行函数 next（’/login‘） 强制跳转
  if (to.path === '/login') return next()
  // 获取token
  const tokenStr = window.sessionStorage.getItem('token')
  if (!tokenStr) {
    return next('/login')
  } else {
    next()
  }
})

export default router
