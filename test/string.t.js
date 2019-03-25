// const Vue = require('vue/dist/vue')
// const VueSyncData = require('../dist/vue-sync-data.umd.js')
// const VueRouter = require('vue-router')

// Vue.use(VueSyncData)
// Vue.use(VueRouter)

// //eslint-disable-next-line no-undef
// test('update content after changing state', async () => {
//   const template = `
//     <div>
//     <span>{{ string }}</span>
//     </div>`

//   const Home = { template: '<div>Home</div>' }
//   const Foo = { template: '<div>Foo</div>' }

//   const router = new VueRouter({
//     mode: 'history',
//     routes: [{ path: '/', component: Home }, { path: '/foo', component: Foo }]
//   })

//   const vm = new Vue({
//     router,
//     data() {
//       return { string: 'TEST' }
//     },
//     syncData: {
//       string: {
//         name: 'string',
//         type: String
//       }
//     },
//     template
//   }).$mount()

//   // Change state and wait for one tick until checking
//   vm.$router.push({ query: { string: 'NEW' } })

//   console.log(vm.$syncData) //eslint-disable-line

//   await Vue.nextTick()
//   await Vue.nextTick()
//   await Vue.nextTick()
//   await Vue.nextTick()
//   await Vue.nextTick()
//   await Vue.nextTick()

//   //eslint-disable-next-line no-undef
//   expect(vm.$el.innerHTML).toEqual(expect.stringContaining('TEST')) // NOT RIGHT
// })
