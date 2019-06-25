const VueSyncData = require('../dist/vue-sync-data.cjs.js')
const VueRouter = require('vue-router')
import { shallowMount, createLocalVue } from '@vue/test-utils'

const localVue = createLocalVue()
localVue.use(VueSyncData)

const component = {
  data() {
    return { string: 'TEST' }
  },
  syncData: {
    string: {
      name: 'string',
      type: String
    }
  },
  template: '<input v-model="string"></input>'
}

const router = new VueRouter({
  routes: [{ path: '/', component }]
})

const $route = {
  path: '/',
  query: {
    string: 'NEW TEXT'
  }
}

const wrapper = shallowMount(component, {
  localVue,
  router,
  mocks: {
    $route
  },
  attachToDocument: true
})

//eslint-disable-next-line no-undef
test('object', async () => {
  wrapper.setData({ string: 'new Text' })
})
