import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)
const Recommend = (resolve) => { // 路由懒加载
  import('components/recommend/recommend').then((module) => {
    resolve(module)
  })
}

const Singer = (resolve) => { // 路由懒加载
  import('components/Singer/Singer').then((module) => {
    resolve(module)
  })
}

const Search = (resolve) => { // 路由懒加载
  import('components/Search/Search').then((module) => {
    resolve(module)
  })
}
const SingerDetail = (resolve) => { // 路由懒加载
  import('components/singer-detail/singer-detail').then((module) => {
    resolve(module)
  })
}
const Disc = (resolve) => { // 路由懒加载
  import('components/Disc/Disc').then((module) => {
    resolve(module)
  })
}
const TopList = (resolve) => { // 路由懒加载
  import('components/top-list/top-list').then((module) => {
    resolve(module)
  })
}
const UserCenter = (resolve) => { // 路由懒加载
  import('components/user-center/user-center').then((module) => {
    resolve(module)
  })
}

const Rank = (resolve) => { // 路由懒加载
  import('components/Rank/Rank').then((module) => {
    resolve(module)
  })
}

export default new Router({
  mode: 'history',
  linkActiveClass: 'active',
  routes: [
    {
      path: '/',
      redirect: '/recommend'
    },
    {
      path: '/recommend',
      component: Recommend,
      children: [
        {
          path: ':id',
          component: Disc
        }
      ]
    },
    {
      path: '/singer',
      component: Singer,
      children: [
        {
          path: ':id',
          component: SingerDetail
        }
      ]
    },
    {
      path: '/rank',
      component: Rank,
      children: [
        {
          path: ':id',
          component: TopList
        }
      ]
    },
    {
      path: '/search',
      component: Search,
      children: [
        {
          path: ':id',
          component: SingerDetail
        }
      ]
    },
    {
      path: '/user',
      component: UserCenter
    }
  ]
})
