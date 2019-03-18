export default function extend(Vue) {
  if (!Vue.prototype.hasOwnProperty('$syncData')) {
    Object.defineProperty(Vue.prototype, '$syncData', {
      get() {
        return this._syncData
      }
    })
  }
}
