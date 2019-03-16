vue-sync-query
Auto Sync Vue Data to Query String

install

npm install --save vue-sync-query

import Vue from 'vue'
import VueSyncQuery from 'vue-sync-query'
Vue.use(VueSyncQuery)

export default {
    data() {
        myNameString: 'This is my String'
    },
    syncQuery: {
        myNameString: {
            type: String,
            name: 'name'
        }
    }
}

Now the query is kept in Sync with the Value

Options for the watchers

type: 
- required
- String | Number | Boolean | Array | Object

name: 
- required
- typeof String

nullable:
- typeof Boolean

validate: 
- typeof === 'function'
eg. function(value) {
    if(!value) return false
    return true
}

proto: 
- Only for type Object
- typeof Object
eg. {
    value: {
        type: Number,
        name: value
    }
}
