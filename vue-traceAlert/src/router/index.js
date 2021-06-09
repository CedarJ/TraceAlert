import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Index',
      component: () => import('@/views/index')
    },
    {
      path: '/signUp',
      name: 'SignUp',
      component: () => import('@/views/sign-up')
    },
    {
      path: '/signIn',
      name: 'SignIn',
      component: () => import('@/views/sign-in')
    },
    {
      path: '/mime',
      name: 'mime',
      component: () => import('@/views/mime')
    },
    {
      path: '/profile',
      name: 'profile',
      component: () => import('@/views/profile')
    },
    {
      path: '/qr',
      name: 'Qr',
      component: () => import('@/views/qr')
    },
    {
      path: '/visited',
      name: 'Visited',
      component: () => import('@/views/visited')
    },
    {
      path: '/visited/detail/:id',
      name: 'VisitedDetail',
      component: () => import('@/views/visited/detail')
    }
  ]
})
