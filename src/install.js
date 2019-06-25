import { warn } from './util'
import extend from './extend'
import mixin from './mixin'

export let Vue

export function install(_Vue) {
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

  extend(Vue)
  Vue.mixin(mixin)

  const strategies = Vue.config.optionMergeStrategies
  strategies.syncData = strategies.props
}
