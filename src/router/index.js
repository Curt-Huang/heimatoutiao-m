import Vue from 'vue'
import VueRouter from 'vue-router'

const Layout = () => import('@/views/layout')
const Home = () => import('@/views/home')
const Video = () => import('@/views/video')
const Question = () => import('@/views/question')
const User = () => import('@/views/user')

const Profile = () => import('@/views/user/profile')
const Chat = () => import('@/views/user/chat')
const Login = () => import('@/views/login')

const Search = () => import('@/views/search')
const SearchResult = () => import('@/views/search/result')

const Article = () => import('@/views/article')
Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'layout',
    component: Layout,
    children: [{
      path: '/',
      component: Home
    }, {
      path: '/video',
      component: Video
    }, {
      path: '/question',
      component: Question
    }, {
      path: '/user',
      component: User
    }]
  }, {
    path: '/user/profile',
    component: Profile
  }, {
    path: '/user/chat',
    component: Chat
  }, {
    path: '/login',
    component: Login
  }, {
    path: '/search',
    component: Search
  }, {
    path: '/search/result',
    component: SearchResult
  }, {
    path: '/article',
    component: Article
  }

]

const router = new VueRouter({
  routes
})

export default router
