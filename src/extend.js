export default function extend(Vue) {
  if (!Vue.prototype.hasOwnProperty('$syncQuery')) {
    Object.defineProperty(Vue.prototype, '$syncQuery', {
      get() {
        return this._syncQuery
      }
    })
  }
}
