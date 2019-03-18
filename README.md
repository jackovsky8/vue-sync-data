# vue-sync-data
### Auto Sync Vue Data to Query String

## install

```javascript
npm install --save vue-sync-data
```

```javascript
import Vue from 'vue'
import VueSyncData from 'vue-sync-data'
Vue.use(VueSyncData)

export default {
    data() {
        myNameString: 'This is my String'
    },
    dataSync: {
        myNameString: {
            type: String,
            name: 'name'
        }
    }
}
```

Now the query is kept in Sync with the Value

Options for the watchers

```javascript
type: 
- required
- String | Number | Boolean | Array | Object

name: 
- required
- String

nullable:
- Boolean

validate: 
- Function // You receive newValue as first Argument and return Boolean

proto: 
- required when type Object
- Object of watchers
```

## developing
```javascript
npm run test // Run Tests
npm run build // Build the Package
npm run lint // Lint the Package
```
