import VueSyncData from './main'
import _ from 'lodash'
import { warn } from './util'

export function _getValidSyncObjects(objects) {
  let object = {}

  for (let key in objects) {
    // skip loop if the property is from prototype
    if (!objects.hasOwnProperty(key)) continue

    let obj = objects[key]

    if (!VueSyncData._validateSyncObject(obj, key)) continue

    object[key] = obj
  }

  return object
}

// Validate a Watcher Options Object
export function _validateSyncObject(element, key) {
  // Check if name value is given and typeof String
  if (!element.name || !_.isString(element.name)) {
    warn(
      'The value "name" of the syncData Options Object ' +
        key +
        'has to be a String!'
    )
    return false
  }
  // Check type value is given and the right type
  if (
    !element.type ||
    !_.isObject(element.type) ||
    !element.type.name ||
    !(
      element.type.name === 'String' ||
      element.type.name === 'Number' ||
      element.type.name === 'Boolean' ||
      element.type.name === 'Array' ||
      element.type.name === 'Object'
    )
  ) {
    warn(
      'The value "type" of the syncData Options Object ' +
        key +
        'has to be one of String | Number | Boolean | Array | Object!'
    )
    return false
  }
  // Check the Nullable Value
  if (
    (element.nullable !== undefined || element.nullable !== null) &&
    !_.isBoolean(element.nullable)
  ) {
    warn(
      'The value "nullable" of the syncData Options Object ' +
        key +
        'has to be a Boolean!'
    )
    return false
  }
  // Check if the validate function is a null or a function
  if (element.validate && typeof element.validate !== 'function') {
    warn(
      'The value "validate" of the syncData Options Object ' +
        key +
        'has to be a function!'
    )
    return false
  }
  // Check the proto Object
  if (element.type.name === 'Object') {
    if (
      !element.proto ||
      !_.isObject(element.proto) ||
      _.isEmpty(element.proto)
    ) {
      warn('The Value proto is required for Objects')
      return false
    } else {
      for (let k in element.proto) {
        // skip loop if the property is from prototype
        if (!element.proto.hasOwnProperty(k)) continue

        let el = element.proto[k]

        if (!VueSyncData._validateSyncObject(el, key + '.' + k)) return false
      }
    }
  }
  // Otherwise return the valid element
  return element
}
