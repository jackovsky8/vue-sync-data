import { install, Vue } from './install'
import { warn } from './util'
import { isObject, isEmpty, isArray, isString, isBoolean, set } from 'lodash'

class ValueWatchFn {
  _object
  _expression
  _parent
  _syncValue

  constructor(object, expression, parent) {
    this._object = object
    this._expression = expression
    this._parent = parent
    this._syncValue = parent._syncValue
  }

  watchFn = newValue => {
    if (newValue === undefined || newValue === null || isEmpty(newValue))
      this._parent._vm.$delete(
        this._syncValue.query,
        this._object.name,
        newValue
      )
    else
      this._parent._vm.$set(this._syncValue.query, this._object.name, newValue)
  }
}

class RouteWatchFn {
  parent

  constructor(parent) {
    this.parent = parent
  }

  watchFn = (newValue, oldValue) => {
    this.parent.readQuery()
  }
}

class QueryWatchFn {
  parent

  constructor(parent) {
    this.parent = parent
  }

  watchFn = (newValue, oldValue) => {
    this.parent.setQuery()
  }
}

export default class SyncQuery {
  static install = install

  _vm
  _watchers
  _route_watcher
  _query_watcher
  _query
  _syncValue

  constructor(vm) {
    if (vm instanceof Vue) {
      this._vm = vm
    } else {
      warn('You have to give the Vue instance to Sync Query!')
      return
    }

    // Check if Component has registered watchers
    const options = this._vm.$options
    options.syncQuery = options.syncQuery || (options.__syncQuery ? {} : null)

    let objects = {}

    if (options.syncQuery && isObject(options.syncQuery)) {
      warn(`some Data to Sync given ${vm._uid}`)
      objects = this._getValidSyncObjects(options.syncQuery)
    }

    // Copy the Reference from the vm to this array
    this._syncValue = vm.syncQuery

    // If No Sync Watchers are given, nothing to do
    if (isEmpty(objects)) return

    // Set Watchers for the Given Values
    this._setWatchers(objects)

    // Finally read the query
    this.readQuery()
  }

  // Get only valid watcher Objects
  _getValidSyncObjects(objects) {
    let object = {}

    for (let key in objects) {
      // skip loop if the property is from prototype
      if (!objects.hasOwnProperty(key)) continue

      let obj = objects[key]

      if (!obj.name || !isString(obj.name)) {
        warn(`The value 'name' of the syncQuery Object has to be a String!`)
        continue
      }
      if (
        !obj.type ||
        !isObject(obj.type) ||
        !obj.type.name ||
        !(
          obj.type.name === 'String' ||
          obj.type.name === 'Number' ||
          obj.type.name === 'Boolean' ||
          obj.type.name === 'Array'
        )
      ) {
        warn(
          `The value 'type' of the syncQuery Object has to be a String | Number | Boolean | Array!`
        )
        continue
      }
      if (obj.nullable && !isBoolean(obj.nullable)) {
        warn(
          `The value 'nullable' of the syncQuery Object has to be a Boolean!`
        )
        continue
      }
      if (obj.validate && typeof obj.validate !== 'function') {
        warn(
          `The value 'validate' of the syncQuery Object has to be a function!`
        )
        continue
      }
      object[key] = obj
    }

    return object
  }

  _setWatchers(elements) {
    if (!this._vm) return

    // Set the Value Watchers
    // But first Unset if there are existing already some
    this._unsetWatchers()

    const keys = Object.keys(elements)
    const self = this
    keys.forEach(key => {
      const element = elements[key]
      const watchFn = new ValueWatchFn(element, key, self)

      // Save the watcher in the Object
      self._watchers.push({
        unwatchFn: null,
        expression: key,
        name: element.name,
        type: element.type,
        nullable: element.nullable !== undefined ? element.nullable : true,
        validate:
          typeof element.validate === 'function' ? element.validate : null,
        watchFn
      })
      // Create Vue Watcher
      self._watchers[self._watchers.length - 1].unwatchFn = self._vm.$watch(
        key,
        watchFn.watchFn
      )
    })

    // Create Route Watcher
    let watchFnRoute = new RouteWatchFn(this)
    this._route_watcher = {
      unwatchFn: null,
      expression: '$route',
      watchFn: watchFnRoute
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
      expression: 'syncQuery.query',
      watchFn: watchFnQuery
    }
    // Create Vue Watcher
    this._query_watcher.unwatchFn = this._vm.$watch(
      'syncQuery.query',
      watchFnQuery.watchFn,
      { deep: true }
    )
  }

  _unsetWatchers() {
    // Unset Value Watchers
    if (this._watchers && isArray(this._watchers)) {
      this._watchers.forEach(watcher => {
        watcher.unwatchFn()
      })
    }

    this._watchers = []

    // Unset Route Watcher
    // this._route_watcher.unwatchFn()
    // delete this._route_watcher

    // Unset Query Watcher
    // this._query_watcher.unwatchFn()
    // delete this._query_watcher
  }

  readQuery = function() {
    if (!this._vm.$route) {
      warn('Vue Router is required!')
      return
    }

    const query = this._vm.$route.query

    if (query && isObject(query) && !isEmpty(query)) {
      for (let key in this._watchers) {
        // skip loop if the property is from prototype
        if (!this._watchers.hasOwnProperty(key)) continue

        let obj = this._watchers[key]
        let type = obj.type.name

        if (type === 'Object') {
          console.log('Objecterl')
        }

        let value = this._vm.$route.query[obj.name]
        if (value !== undefined) {
          set(this._vm, obj.expression, value)
        }
      }
    }
  }

  // Set the query
  setQuery = function() {
    if (!this._vm.$router) return

    this._vm.$router.push({ query: this._syncValue.query })
  }
}

//   readQuery: function() {
//     if (!this.vm) return

//     this.query = clone(this.vm.$route.query)

//     for (let key in this.watchers) {
//       // skip loop if the property is from prototype
//       if (!this.watchers.hasOwnProperty(key)) continue

//       let obj = this.watchers[key]
//       let type = obj.options.type.name

//       switch (type) {
//         case 'Array':
//           console.log('treat like array')
//           this.readArray(obj)
//           break
//         case 'Object':
//           console.log('treat like object')
//           this.readObject(obj)
//           break
//         case 'String':
//           console.log('treat like string')
//           this.readString(obj)
//           break
//         case 'Number':
//           console.log('treat like number')
//           this.readNumber(obj)
//           break
//         case 'Boolean':
//           console.log('treat like boolean')
//           this.readBoolean(obj)
//           break
//         default:
//           throw new Error('type is not supported')
//       }
//     }
//   },
//   readString: function({ expression, options }) {
//     console.log('read String')
//     // Proto has to be string
//     let value = this.vm.$route.query[options.proto]
//     if (value) {
//       set(this.vm, expression, value)
//     }
//   },
//   setString: function(value, { expression, options }) {
//     console.log('set String')
//     // Proto has to be string
//     // let value = this.vm.$route.query[options.proto]
//     // if (value) {
//     //   set(this.vm, expression, value)
//     // }
//   },
//   readNumber: function({ expression, options }) {
//     console.log('read Number')
//     // Proto has to be string
//     let value = this.vm.$route.query[options.proto]
//     if (value) {
//       set(this.vm, expression, parseFloat(value))
//     }
//   },
//   setNumber: function(value, { expression, options }) {
//     console.log('set Number')
//     // Proto has to be string
//     // let value = this.vm.$route.query[options.proto]
//     // if (value) {
//     //   set(this.vm, expression, value)
//     // }
//   },
//   readBoolean: function({ expression, options }) {
//     console.log('read Boolean')
//     // Proto has to be string
//     let value = this.vm.$route.query[options.proto]
//     if (value) {
//       set(this.vm, expression, JSON.parse(value))
//     }
//   },
//   setBoolean: function(value, { expression, options }) {
//     console.log('set Boolean')
//   },
//   readArray: function({ expression, options }) {
//     console.log('read Boolean')
//     // Proto has to be string
//     let value = this.vm.$route.query[options.proto]
//     if (value) {
//       set(this.vm, expression, value)
//     }
//   },
//   setArray: function(value, { expression, options }) {
//     console.log('set Boolean')
//   },
//   readObject: function({ expression, options }) {
//     console.log('read Boolean')
//     // Proto has to be string
//     let value = this.vm.$route.query[options.proto]
//     if (value) {
//       set(this.vm, expression, value)
//     }
//   },
//   setObject: function(value, { expression, options }) {
//     console.log('set Boolean')
//   }
// }

// const object = {
//   vm: null,
//   watchers: [],
//   route_watcher: null,
//   query: {},
//   $sync: null,
//   router_query: {},
//   init: function(vm) {
//     this.vm = vm
//     const objects = vm.$options.__proto__.sync
//     if (isObject(objects)) {
//       this.addWatchers(vm, objects)
//     }
//     // Read the Query on start
//     this.readQuery()
//     // delete this.init
//   },
//   addWatchers: function(vm = this.vm, elements) {
//     if (!vm) throw new Error('No Vue Instance Given!')

//     if (!isObject(elements))
//       throw new Error('Second Value is expected to be an Object!')

//     const keys = Object.keys(elements)

//     keys.forEach(key => {
//       let element = elements[key]
//       let watchFn = new this.WatchFnPrototype(element, key, vm, this)
//       // Save the watcher in the Object
//       this.watchers.push({
//         unwatchFn: null,
//         expression: key,
//         watchFn,
//         options: element
//       })
//       // Create Vue Watcher
//       this.watchers[this.watchers.length - 1].unwatchFn = vm.$watch(
//         key,
//         watchFn.watchFn,
//         { deep: true }
//       )
//     })

//     if (keys.length > 0) {
//       vm.$data.$sync = {
//         query: {}
//       }

//       this.$sync = vm.$data.$sync
//     }

//     // Create Route Watcher
//     let watchFnRoute = new this.WatchFnRoutePrototype(vm, this)
//     this.route_watcher = {
//       unwatchFn: null,
//       expression: '$route',
//       watchFn: watchFnRoute
//     }
//     // Create Vue Watcher
//     this.route_watcher.unwatchFn = vm.$watch('$route', watchFnRoute.watchFn)

//     // Create Query Watcher
//     let watchFnQuery = new this.WatchFnQueryPrototype(vm, this)
//     this.query_watcher = {
//       unwatchFn: null,
//       expression: '$sync.query',
//       watchFn: watchFnQuery
//     }
//     // Create Vue Watcher
//     this.route_watcher.unwatchFn = vm.$watch(
//       '$sync.query',
//       watchFnQuery.watchFn
//     )
//   },
//   removeWatchers(vm = this.vm, elements) {
//     if (!vm) throw new Error('No Vue Instance Given!')

//     if (!isArray(elements))
//       throw new Error('Second Value is expected to be an Array!')

//     elements.forEach(element => {
//       vm.$watch(element, this.watchFn)
//     })
//   },
//   WatchFnRoutePrototype(vm, parent) {
//     this.vm = vm
//     this.parent = parent
//     this.watchFn = (newValue, oldValue) => {
//       console.log('Route Query Changed')
//       console.log(newValue)
//       console.log(oldValue)
//       parent.readQuery()
//     }
//   },
//   WatchFnQueryPrototype(vm, parent) {
//     this.vm = vm
//     this.parent = parent
//     this.watchFn = (newValue, oldValue) => {
//       console.log('Query Changed')
//       console.log(newValue)
//       console.log(oldValue)
//       parent.setQuery()
//     }
//   },
//   WatchFnPrototype(object, expression, vm, parent) {
//     this.object = object
//     this.expression = expression
//     this.vm = vm
//     this.parent = parent
//     this.watchFn = (newValue, oldValue) => {
//       console.log('Watch of:')
//       console.log(this.expression)
//       this.parent.$sync.query[this.object.proto] = newValue
//       console.log(this.object)
//       console.log(newValue)
//       console.log(oldValue)
//       console.log('edit Value')
//       console.log(get(this.vm, expression, null))
//       // this.parent.setQuery()
//     }
//   },
//   readQuery: function() {
//     if (!this.vm) return

//     this.query = clone(this.vm.$route.query)

//     for (let key in this.watchers) {
//       // skip loop if the property is from prototype
//       if (!this.watchers.hasOwnProperty(key)) continue

//       let obj = this.watchers[key]
//       let type = obj.options.type.name

//       switch (type) {
//         case 'Array':
//           console.log('treat like array')
//           this.readArray(obj)
//           break
//         case 'Object':
//           console.log('treat like object')
//           this.readObject(obj)
//           break
//         case 'String':
//           console.log('treat like string')
//           this.readString(obj)
//           break
//         case 'Number':
//           console.log('treat like number')
//           this.readNumber(obj)
//           break
//         case 'Boolean':
//           console.log('treat like boolean')
//           this.readBoolean(obj)
//           break
//         default:
//           throw new Error('type is not supported')
//       }
//     }
//   },
//   setQuery: function() {
//     this.vm.$router.push({ query: this.$sync.query })
//   },
//   readString: function({ expression, options }) {
//     console.log('read String')
//     // Proto has to be string
//     let value = this.vm.$route.query[options.proto]
//     if (value) {
//       set(this.vm, expression, value)
//     }
//   },
//   setString: function(value, { expression, options }) {
//     console.log('set String')
//     // Proto has to be string
//     // let value = this.vm.$route.query[options.proto]
//     // if (value) {
//     //   set(this.vm, expression, value)
//     // }
//   },
//   readNumber: function({ expression, options }) {
//     console.log('read Number')
//     // Proto has to be string
//     let value = this.vm.$route.query[options.proto]
//     if (value) {
//       set(this.vm, expression, parseFloat(value))
//     }
//   },
//   setNumber: function(value, { expression, options }) {
//     console.log('set Number')
//     // Proto has to be string
//     // let value = this.vm.$route.query[options.proto]
//     // if (value) {
//     //   set(this.vm, expression, value)
//     // }
//   },
//   readBoolean: function({ expression, options }) {
//     console.log('read Boolean')
//     // Proto has to be string
//     let value = this.vm.$route.query[options.proto]
//     if (value) {
//       set(this.vm, expression, JSON.parse(value))
//     }
//   },
//   setBoolean: function(value, { expression, options }) {
//     console.log('set Boolean')
//   },
//   readArray: function({ expression, options }) {
//     console.log('read Boolean')
//     // Proto has to be string
//     let value = this.vm.$route.query[options.proto]
//     if (value) {
//       set(this.vm, expression, value)
//     }
//   },
//   setArray: function(value, { expression, options }) {
//     console.log('set Boolean')
//   },
//   readObject: function({ expression, options }) {
//     console.log('read Boolean')
//     // Proto has to be string
//     let value = this.vm.$route.query[options.proto]
//     if (value) {
//       set(this.vm, expression, value)
//     }
//   },
//   setObject: function(value, { expression, options }) {
//     console.log('set Boolean')
//   }
// }
