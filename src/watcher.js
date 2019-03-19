export class ValueWatchFn {
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
