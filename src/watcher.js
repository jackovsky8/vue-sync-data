import _ from 'lodash'
export class ValueWatchFn {
  _object
  _parent
  _throttle

  constructor(object, parent) {
    this._object = object
    this._parent = parent

    // Set Throttler for changing object
    if (object.throttled) {
      this._throttle = _.throttle(newValue => {
        this._parent._syncData.data[this._object.name] = newValue
      }, object.throttled)
    }
  }

  watchFn = newValue => {
    window.requestAnimationFrame(() => {
      if (this._throttle) this._throttle(newValue)
      else this._parent._syncData.data[this._object.expression] = newValue
    })
  }
}

export class DataWatchFn {
  _object
  _parent

  constructor(object, parent) {
    this._object = object
    this._parent = parent
  }

  watchFn = newValue => {
    this._parent._setValueToQuery(newValue, this._object)
  }
}

export class RouteWatchFn {
  _parent

  constructor(parent) {
    this._parent = parent
  }

  watchFn = () => {
    this._parent.readQuery()
  }
}

export class QueryWatchFn {
  _parent

  constructor(parent) {
    this._parent = parent
  }

  watchFn = () => {
    this._parent.setQuery()
  }
}
