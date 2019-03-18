/**
 * utilities
 */

export function warn(msg, err) {
  if (typeof console !== 'undefined') {
    console.warn('[vue-sync-data] ' + msg) // eslint-disable-line no-console
    if (err) {
      console.warn(err.stack) // eslint-disable-line no-console
    }
  }
}
