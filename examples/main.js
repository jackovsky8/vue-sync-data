import Vue from 'vue'
import All from './All'
import App from './App'
import Number from './Number'
import Boolean from './Boolean'
import String from './String'
import Array from './Array'
import Object from './Object'
import VueRouter from 'vue-router'
import VueSyncData from 'vue-sync-data'

Vue.use(VueRouter)
Vue.use(VueSyncData)

const router = new VueRouter({
  mode: 'history',
  routes: [
    { path: '/', component: All },
    { path: '/number', component: Number },
    { path: '/boolean', component: Boolean },
    { path: '/string', component: String },
    { path: '/array', component: Array },
    { path: '/object', component: Object }
  ]
})

new Vue({
  router,
  el: '#app',
  render: h => h(App)
})
