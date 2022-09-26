import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/login')
  }, {
    path: '/',
    name: 'layout',
    redirect: '/home', // 默认子路由页面
    component: () => import('@/views/layout'),
    children: [
      {
        path: 'home',
        name: 'home',
        component: () => import('@/views/home')
      }, {
        path: 'qa',
        name: 'qa',
        component: () => import('@/views/qa')

      }, {
        path: 'video',
        name: 'video',
        component: () => import('@/views/video')
      }, {
        path: 'my',
        name: 'my',
        component: () => import('@/views/my')
      }
    ]
  }, {
    path: '/search',
    name: 'search',
    component: () => import('@/views/search')
  }, {
    // 将路由动态参数映射到组件的props 中,更推荐这种做法
    path: '/article/:articleId',
    name: 'article',
    component: () => import('@/views/article'),
    props: true
  },
  {
    // 将路由动态参数映射到组件的props 中,更推荐这种做法
    path: '/user/profile',
    name: 'user-profile',
    component: () => import('@/views/user-profile')
  }
]

const router = new VueRouter({
  routes
})

export default router
