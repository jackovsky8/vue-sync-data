import { install, Vue } from './install'
import { getValidSyncObjects, validateSyncObject } from './validate'
import { warn } from './util'
import { standardToNull, nullObjectFromProto } from './helper'
import {
  ValueWatchFn,
  RouteWatchFn,
  QueryWatchFn,
  DataWatchFn
} from './watcher'
import _ from 'lodash'

export default class VueSyncData {
  static install = install

  // Static Helper Functions
  static _getValidSyncObjects = getValidSyncObjects
  static _validateSyncObject = validateSyncObject
  static _standardToNull = standardToNull
  static _nullObjectFromProto = nullObjectFromProto

  _vm
  _value_watchers
  _route_watcher
  _query_watcher
  _data_watchers
  _syncData
  _lockReader = []
  _lockSetter = []

  constructor(vm) {
    if (vm instanceof Vue) {
      this._vm = vm
    } else {
      warn('You have to give the Vue instance of your component to Sync Data!')
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
    this._syncData = vm.syncData

    // If No Sync Watchers are given, nothing to do
    if (_.isEmpty(objects)) return

    // Set Watchers for the Given Values
    this._setWatchers(objects)

    // Finally read the query
    this.readQuery()
  }

  _setWatchers(elements) {
    if (!this._vm) return

    // First Unset if there are existing already some
    this._unsetWatchers()

    // Set the Value Watchers
    const keys = Object.keys(elements)
    const self = this

    keys.forEach(key => {
      let element = elements[key]

      const valueWatchFn = new ValueWatchFn(element, self)
      const deep = element.type.name === 'Object'

      // Set the standard for all Objects
      element = {
        ...elements[key],
        unwatchFn: null,
        watchFn: valueWatchFn,
        expression: element.expression,
        name: element.name,
        type: element.type,
        nullable: element.nullable,
        toNull: element.toNull,
        validate: element.validate,
        throttled: element.throttled,
        proto: deep ? element.proto : undefined,
        deep
      }

      // Save the watcher in the Object
      self._value_watchers.push({ ...element })

      // Create Vue Watcher
      self._value_watchers[
        self._value_watchers.length - 1
      ].unwatchFn = self._vm.$watch(key, valueWatchFn.watchFn, { deep })

      // Save the data to make it reacvtive
      self._vm.$set(
        self._syncData.data,
        element.name,
        _.get(self._vm, element.expression)
      )

      // Create Data Watch Fn
      const dataWatchFn = new DataWatchFn(element, self)

      element.expression = 'syncData.data.' + element.name
      element.watchFn = dataWatchFn

      // Save the watcher in the Object
      self._data_watchers.push({ ...element })

      self._data_watchers[
        self._data_watchers.length - 1
      ].unwatchFn = self._vm.$watch(
        'syncData.data.' + element.name,
        dataWatchFn.watchFn,
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
      deep: true
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
    if (this._value_watchers && _.isArray(this._value_watchers)) {
      this._value_watchers.forEach(watcher => {
        watcher.unwatchFn()
      })
    }

    // Unset Data Watchers
    if (this._data_watchers && _.isArray(this._data_watchers)) {
      this._data_watchers.forEach(watcher => {
        watcher.unwatchFn()
      })
    }

    this._value_watchers = []
    this._data_watchers = []

    // Unset Route Watcher
    if (this._route_watcher && this._route_watcher.unwatchFn)
      this._route_watcher.unwatchFn()

    delete this._route_watcher

    // Unset Query Watcher
    if (this._query_watcher && this._query_watcher.unwatchFn)
      this._query_watcher.unwatchFn()

    delete this._query_watcher
  }

  _setValueToQuery = function(newValue, watcher, objectString = null) {
    let value = JSON.parse(JSON.stringify(newValue))

    // If to Null === null || undefined then this function is not used
    if (watcher.toNull !== undefined || watcher.toNull !== null)
      if (watcher.type.name === 'Array' || watcher.type.name === 'Object')
        // If Array Or Object == is not working
        value = _.isEqual(watcher.toNull, value) ? null : value
      // Otherwise == is Perfect
      else value = value == watcher.toNull ? null : value

    // Delete Value if it is Null
    if (value === undefined || value === null)
      this._vm.$delete(
        this._syncData.query,
        (objectString ? objectString + '-' : '') + watcher.name,
        value
      )
    else {
      // Call this function recursivly if an Object
      if (watcher.type.name === 'Object') {
        for (let key in watcher.proto) {
          // skip loop if the property is from prototype
          if (!value.hasOwnProperty(key)) continue

          let value_watcher = watcher.proto[key]

          this._setValueToQuery(
            value[key],
            value_watcher,
            (objectString ? objectString + '-' : '') + watcher.name
          )
        }
      } else {
        // Otherwise set the Value
        this._vm.$set(
          this._syncData.query,
          (objectString ? objectString + '-' : '') + watcher.name,
          value
        )
      }
    }
  }

  _readValueFromQuery = function(watcher, objectString = null) {
    if (watcher.type.name === 'Object') {
      let value = {}

      // Read the Values from the Proto
      for (let key in watcher.proto) {
        // skip loop if the property is from prototype
        if (!watcher.proto.hasOwnProperty(key)) continue
        value[key] = this._readValueFromQuery(watcher.proto[key], watcher.name)
      }

      if (_.isEmpty(value)) value = null

      // Validate Object
      if (!this._validateValue(watcher, value)) value = null

      // Handle Null Values if not allowed by proto
      if (!watcher.nullable && value === null)
        if (watcher.toNull !== null || watcher.toNull !== undefined)
          // If some specific Value is to null, set this one
          value = watcher.toNull
        // If Object is not nullable, and no toNull is given, create the Proto Object
        else value = VueSyncData._nullObjectFromProto(watcher.proto)

      return value
    } else {
      let value = this._vm.$route.query[
        (objectString ? objectString + '-' : '') + watcher.name
      ]

      // Set to null if ''
      value = value === '' ? null : value

      // Validate Value
      if (!this._validateValue(watcher, value)) value = null

      // Handle Values
      if (
        (watcher.toNull !== undefined || watcher.toNull !== null) &&
        value === null &&
        watcher.nullable === false
      )
        value = watcher.toNull
      else
        switch (watcher.type.name) {
          case 'Array':
            if (!watcher.nullable) value = []
            else if (value === undefined || value === null || _.isEmpty(value))
              value = null
            else value = _.isArray(value) ? value : [value]
            break
          case 'Number':
            if (!watcher.nullable) value = 0
            else if (value === undefined || value === null) value = null
            else value = parseFloat(value)
            break
          case 'Boolean':
            if (!watcher.nullable) value = false
            else if (value === undefined || value === null) value = null
            else
              value = _.isBoolean(value)
                ? value
                : value === 'true'
                  ? true
                  : false
            break
          case 'String':
            if (!watcher.nullable) value = ''
            else if (value === undefined || value === null) value = null
            break
        }

      return value
    }
  }

  _validateValue(watcher, value) {
    console.log(watcher) //eslint-disable-line
    console.log(value) // eslint-disable-line
    return true
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

    // if (query && _.isObject(query) && !_.isEmpty(query)) {
    for (let key in this._value_watchers) {
      // skip loop if the property is from prototype
      if (!this._value_watchers.hasOwnProperty(key)) continue

      value[this._value_watchers[key].name] = this._readValueFromQuery(
        this._value_watchers[key]
      )
    }

    this._lockSetter = query

    for (let key in value) {
      // skip loop if the property is from prototype
      if (!value.hasOwnProperty(key)) continue

      if (value[key] !== undefined) {
        // Get the watcher by name & set the value to the component
        let watcher = this._value_watchers.filter(el => el.name === key)
        _.set(this._vm, watcher[0].expression, value[key])
      }
    }
    // }
  }

  // Set the query
  setQuery = function() {
    if (!this._vm.$router) return

    const query = this._syncData.query

    if (this._lockSetter && _.isEqual(this._lockSetter, query)) {
      this._lockSetter = undefined
      return
    }

    this._lockSetter = undefined

    // Save the query
    this._lockReader = { ...query }

    this._vm.$router.push({ query: { ...query } })
  }
}
