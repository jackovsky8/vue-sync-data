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

## Options for the watchers

#### type - Define the Type of the Value
```javascript
type: 
- required
- String | Number | Boolean | Array | Object
```

#### name - Define the Name in the Query
```javascript
name: 
- required
- String
```

#### nullable - Define if the Value gets set to null or '' | 0 | false | [] | {} if the Object does not exist in query
```javascript
nullable:
- Boolean
- default true
```

#### toNull - If a value given no query will be set if (value == toNull), if (toNull === null) a query will be always set
```javascript
toNull:
- Any
- default [String: '' | Number: 0 | Boolean: false | Array: [] | Object: {}]
```

#### validate - Define a validation function for the value, if you return false, the value is deleted from the query
```javascript
validate: 
- Function | null
- default null
```


#### throttled - Add throttle to the value watcher (Useful for inputs with fast typing, otherwise input gonna not be fluid) - Value in Miliseconds
```javascript
throttled: 
- Number | false
- default 2000
```

#### proto - Define the design of the Object you wanna sync with the query, can contain all Options like a normal watcher
```javascript
proto: 
- required when type Object
- Object of watchers
```

## developing
```javascript
npm run test // Run Tests
npm run build // Build the Package
npm run dev // Build the Package and watch for changes
npm run lint // Lint the Package
```
