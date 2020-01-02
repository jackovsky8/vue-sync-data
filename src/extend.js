export default function extend(Vue) {
  if (!Object.prototype.hasOwnProperty.call(Vue, '$syncData')) {
    Object.defineProperty(Vue.prototype, '$syncData', {
      get() {
        return this._syncData
      }
    })
  }
}
