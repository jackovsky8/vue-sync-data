import VueSyncData from './main'

export function standardToNull(type) {
  switch (type.name) {
    case 'Object':
      return {}
    case 'Array':
      return []
    case 'String':
      return ''
    case 'Number':
      return 0
    case 'Boolean':
      return false
  }
}

export function standardFromNull(type) {
  switch (type.name) {
    case 'Object':
      return {}
    case 'Array':
      return []
    case 'String':
      return ''
    case 'Number':
      return 0
    case 'Boolean':
      return false
  }
}

export function nullObjectFromProto(proto) {
  let object = {}

  for (let key in proto) {
    // skip loop if the property is from prototype
    if (!proto.hasOwnProperty(key)) continue

    switch (proto[key].type.name) {
      case 'Boolean':
        object.key = false
        break
      case 'String':
        object.key = ''
        break
      case 'Number':
        object.key = 0
        break
      case 'Array':
        object.key = []
        break
      case 'Object':
        object.key = null
        if (!proto[key].nullable)
          object.key = VueSyncData._nullObjectFromProto(proto[key].proto)
    }
  }
}
