import VueSyncData from './main'
import _ from 'lodash'
import { warn } from './util'

// Get all valid Objects
export function getValidSyncObjects(objects) {
  let obj = {}

  for (let key in objects) {
    // skip loop if the property is from prototype
    if (!objects.hasOwnProperty(key)) continue

    let object = VueSyncData._validateSyncObject(objects[key], key)

    if (!object) continue

    obj[key] = object
  }

  return obj
}

// Validate a Watcher Options Object
export function validateSyncObject(element, key) {
  // Copy the Element and save the Expression to the element
  element = { ...element, expression: key }

  // Check if name value is given and typeof String
  if (!element.name || !_.isString(element.name)) {
    warn(
      'The value "name" of the syncData Options Object ' +
        key +
        ' is required and has to be a String!'
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
        ' is required and has to be one of String | Number | Boolean | Array | Object!'
    )
    return false
  }

  // Check the Nullable Value
  if (element.nullable !== undefined && !_.isBoolean(element.nullable)) {
    warn(
      'The value "nullable" of the syncData Options Object ' +
        key +
        ' has to be a Boolean!'
    )
    return false
  } else if (element.nullable === undefined) {
    // Set the standard
    element.nullable = true
  }

  // Set the to toNull Value to Standard if no value given
  // Null turns this off, all other values are allowed
  if (element.toNull === undefined) {
    element.toNull = VueSyncData._standardToNull(element.type)
  }

  // Check if the validate function is a null or a function
  if (element.validate && typeof element.validate !== 'function') {
    warn(
      'The value "validate" of the syncData Options Object ' +
        key +
        ' has to be a function!'
    )
    return false
  }

  // Check the throttled value
  if (
    !(element.throttled === undefined || element.throttled === null) &&
    (!typeof element.throttled === 'number' || !element.throttled === false)
  ) {
    warn(
      'The value "throttled" of the syncData Options Object ' +
        key +
        ' has to be a number or false!'
    )
    return false
  } else if (element.throttled === undefined || element.throttled === null) {
    // Set standard Value
    element.throttled = 3000
  }

  // Check the proto Object
  if (element.type.name === 'Object') {
    if (
      !element.proto ||
      !_.isObject(element.proto) ||
      _.isEmpty(element.proto)
    ) {
      warn('The Value proto is required for Object' + key)
      return false
    } else {
      // Create a new proto for the Object
      let proto = {}
      for (let k in element.proto) {
        // skip loop if the property is from prototype
        if (!element.proto.hasOwnProperty(k)) continue

        // Validate the key of the Object
        let el = VueSyncData._validateSyncObject(
          element.proto[k],
          key + '.' + k
        )

        // Add the proto to the new proto
        proto[k] = el
      }

      // If the Proto is Empty, return False
      if (_.isEmpty(proto)) return false

      // Add Proto to Element
      element.proto = proto
    }
  }

  // If not returned false yet, return the newly created watcher.
  return element
}
