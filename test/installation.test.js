const Vue = require('vue/dist/vue')
const VueSyncData = require('../dist/vue-sync-data.umd.js')

Vue.use(VueSyncData)

//eslint-disable-next-line no-undef
test('update content after changing state', () => {
  const template = `
    <div>
    <span>{{ variable }}</span>
    </div>`

  const vm = new Vue({
    data: { variable: 123 },
    template
  }).$mount()

  // Change state and wait for one tick until checking
  vm.variable = '567'
  Vue.nextTick(function() {
    //eslint-disable-next-line no-undef
    expect(vm.$el.innerHTML).toEqual(expect.stringContaining('567'))
  })
})
