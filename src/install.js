import { warn } from './util'
import extend from './extend'
import mixin from './mixin'

export let Vue

export function install(_Vue, options = {}) {
  if (
    process.env.NODE_ENV !== 'production' &&
    install.installed &&
    _Vue === Vue
  ) {
    warn('already installed.')
    return
  }
  install.installed = true

  Vue = _Vue

  // Set Standard Options
  options = {
    ...options
  }

  extend(Vue)
  Vue.mixin(mixin)

  const strategies = Vue.config.optionMergeStrategies
  strategies.syncQuery = strategies.props
}
