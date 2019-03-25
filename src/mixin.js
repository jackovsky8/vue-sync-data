import VueSyncData from './main'

export default {
  data: function() {
    return {
      syncData: {
        query: {},
        data: {}
      }
    }
  },
  created() {
    this._syncData = new VueSyncData(this)
  }
}
