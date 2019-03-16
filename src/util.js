/**
 * utilities
 */

export function warn(msg, err) {
  if (typeof console !== 'undefined') {
    console.warn('[vue-sync-query] ' + msg)
    if (err) {
      console.warn(err.stack)
    }
  }
}

export function isObject(obj) {
  return obj !== null && typeof obj === 'object'
}
