import SyncQuery from './index'

export default {
  data: function() {
    return {
      syncQuery: {
        query: {}
      }
    }
  },
  created() {
    this._syncQuery = new SyncQuery(this)
  }
}
