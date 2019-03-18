import VueSyncData from './main'

export default {
  data: function() {
    return {
      syncQuery: {
        query: {}
      }
    }
  },
  created() {
    this._syncQuery = new VueSyncData(this)
  }
}
