import { install, Vue } from './install'
import { _getValidSyncObjects, _validateSyncObject } from './validate'
import { warn } from './util'
import { ValueWatchFn, RouteWatchFn, QueryWatchFn } from './watcher'
import _ from 'lodash'
export default class VueSyncData {
  static install = install

  // Static Helper Functions
  static _getValidSyncObjects = _getValidSyncObjects
  static _validateSyncObject = _validateSyncObject

  _vm
  _watchers
  _route_watcher
  _query_watcher
  _query
  _syncValue
  _lockReader = []
  _lockSetter = []

  constructor(vm) {
    if (vm instanceof Vue) {
      this._vm = vm
    } else {
      warn('You have to give the Vue instance to Sync Query!')
      return
    }

    // Check if Component has registered watchers
    const options = this._vm.$options
    options.syncData = options.syncData || (options.__syncData ? {} : null)

    let objects = {}

    if (options.syncData && _.isObject(options.syncData)) {
      objects = VueSyncData._getValidSyncObjects(options.syncData)
    }

    // Copy the Reference from the vm to this array
    this._syncValue = vm.syncData

    // If No Sync Watchers are given, nothing to do
    if (_.isEmpty(objects)) return

    // Set Watchers for the Given Values
    this._setWatchers(objects)

    // Finally read the query
    this.readQuery()
  }

  _setWatchers(elements) {
    if (!this._vm) return

    // Set the Value Watchers
    // But first Unset if there are existing already some
    this._unsetWatchers()

    const keys = Object.keys(elements)
    const self = this
    keys.forEach(key => {
      let element = elements[key]
      element = {
        ...elements[key],
        nullable: element.nullable !== undefined ? element.nullable : true,
        validate:
          typeof element.validate === 'function' ? element.validate : null,
        throttled:
          typeof element.throttled === 'number'
            ? element.throttled
            : typeof element.throttled === 'boolean' && !element.throttled
              ? false
              : 3000
      }

      const watchFn = new ValueWatchFn(element, self)
      const deep = element.type.name === 'Object'

      // Save the watcher in the Object
      self._watchers.push({
        unwatchFn: null,
        expression: key,
        name: element.name,
        type: element.type,
        nullable: element.nullable,
        validate: element.validate,
        throttled: element.throttled,
        watchFn,
        deep,
        proto: deep ? element.proto : undefined
      })

      // Create Vue Watcher
      self._watchers[self._watchers.length - 1].unwatchFn = self._vm.$watch(
        key,
        watchFn.watchFn,
        { deep }
      )
    })

    // Create Route Watcher
    let watchFnRoute = new RouteWatchFn(this)
    this._route_watcher = {
      unwatchFn: null,
      expression: '$route',
      watchFn: watchFnRoute,
      deep: true
    }
    // Create Vue Watcher
    this._route_watcher.unwatchFn = this._vm.$watch(
      '$route',
      watchFnRoute.watchFn,
      { deep: true }
    )

    // Create Query Watcher
    let watchFnQuery = new QueryWatchFn(this)
    this._query_watcher = {
      unwatchFn: null,
      expression: 'syncData.query',
      watchFn: watchFnQuery,
      deep: false
    }
    // Create Vue Watcher
    this._query_watcher.unwatchFn = this._vm.$watch(
      'syncData.query',
      watchFnQuery.watchFn,
      { deep: true }
    )
  }

  _unsetWatchers() {
    // Unset Value Watchers
    if (this._watchers && _.isArray(this._watchers)) {
      this._watchers.forEach(watcher => {
        watcher.unwatchFn()
      })
    }

    this._watchers = []

    // TODO
    // Unset Route Watcher
    // this._route_watcher.unwatchFn()
    // delete this._route_watcher

    // Unset Query Watcher
    // this._query_watcher.unwatchFn()
    // delete this._query_watcher
  }

  _setValueToQuery = function(newValue, object, objectString = null) {
    if (
      newValue === undefined ||
      newValue === null ||
      (_.isEmpty(newValue) && (_.isObject(newValue) || _.isArray(newValue))) // For Objects and Arrays
    )
      this._vm.$delete(
        this._syncValue.query,
        (objectString ? objectString + '-' : '') + object.name,
        newValue
      )
    else {
      if (object.type.name === 'Object') {
        for (let key in newValue) {
          // skip loop if the property is from prototype
          if (!newValue.hasOwnProperty(key)) continue

          this._setValueToQuery(newValue[key], object.proto[key], object.name)
        }
      } else {
        // this._throttled(
        //   this._vm.$set,
        //   this._syncValue.query,
        //   (objectString ? objectString + '-' : '') + object.name,
        //   newValue
        // )

        this._vm.$set(
          this._syncValue.query,
          (objectString ? objectString + '-' : '') + object.name,
          newValue
        )
      }
    }
  }

  _readValueFromQuery = function(watcher, objectString = null) {
    if (watcher.type.name === 'Object') {
      let object = {}
      for (let key in watcher.proto) {
        // skip loop if the property is from prototype
        if (!watcher.proto.hasOwnProperty(key)) continue
        object[key] = this._readValueFromQuery(watcher.proto[key], watcher.name)
      }
      return object
    } else {
      let value = this._vm.$route.query[
        (objectString ? objectString + '-' : '') + watcher.name
      ]

      switch (watcher.type.name) {
        case 'Array':
          value = value === undefined || _.isArray(value) ? value : [value]
          break
        case 'Number':
          value = value !== undefined ? parseFloat(value) : undefined
          break
        case 'Boolean':
          value = _.isBoolean(value) ? value : value === 'true' ? true : false
          break
      }

      return value
    }
  }

  readQuery = function() {
    if (!this._vm.$route) {
      warn('Vue Router is required!')
      return
    }

    const query = this._vm.$route.query

    if (this._lockReader && _.isEqual(this._lockReader, query)) {
      this._lockReader = undefined
      return
    }

    this._lockReader = undefined

    let value = {}

    if (query && _.isObject(query) && !_.isEmpty(query)) {
      for (let key in this._watchers) {
        // skip loop if the property is from prototype
        if (!this._watchers.hasOwnProperty(key)) continue

        value[this._watchers[key].name] = this._readValueFromQuery(
          this._watchers[key]
        )
      }

      this._lockSetter = query

      for (let key in value) {
        // skip loop if the property is from prototype
        if (!value.hasOwnProperty(key)) continue

        if (value[key] !== undefined) {
          _.set(
            this._vm,
            key, // _watchers[this._watchers[key].name].expression,
            value[key]
          )
        }
      }
    }
  }

  // Set the query
  setQuery = function() {
    if (!this._vm.$router) return

    const query = this._syncValue.query

    if (this._lockSetter && _.isEqual(this._lockSetter, query)) {
      this._lockSetter = undefined
      return
    }

    this._lockSetter = undefined

    // Save the query
    this._lockReader = { ...query }

    this._vm.$router.push({ query: query })
  }
}
