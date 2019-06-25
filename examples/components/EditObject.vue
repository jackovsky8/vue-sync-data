<template>
    <div>
        <span v-if="name">{{ name }}:</span>
        <edit-number v-if="number!==undefined" v-model="number" />
        <edit-boolean v-if="boolean!==undefined" v-model="boolean" />
        <edit-string v-if="string!==undefined" v-model="string" />
        <edit-array v-if="array!==null" v-model="array" />
        <edit-object style="margin-left:15px;" v-if="subObject!==null" v-model="subObject" name="subObject"/>
    </div>
</template>

<script>
import EditNumber from './EditNumber'
import EditBoolean from './EditBoolean'
import EditString from './EditString'
import EditArray from './EditArray'

import _ from 'lodash'

export default {
    name: 'EditObject',
    components: {
        'edit-number': EditNumber,
        'edit-boolean': EditBoolean,
        'edit-string': EditString,
        'edit-array': EditArray
    },
    props: {
        value: {
            type: Object,
            required: true
        },
        name: {
            type: String,
            default: null
        }
    },
    computed: {
        number: {
            get: function() {
                return (this.value && this.value.number !== undefined ? this.value.number : null)
            },
            set: function(newValue) {
                if (newValue !== this.number) 
                    this.$emit('input', {
                        ...this.value,
                        number: newValue
                    })
            }
        },
        boolean: {
            get: function() {
                return (this.input && this.input.boolean !== undefined ? this.input.boolean : null)
            },
            set: function(newValue) {
                if (newValue !== this.boolean) 
                    this.$emit('input', {
                        ...this.value,
                        boolean: newValue
                    })
            }
        },
        string: {
            get: function() {
                return (this.input && this.input.string !== undefined ? this.input.string : null)
            },
            set: function(newValue) {
                if (newValue !== this.string) 
                    this.$emit('input', {
                        ...this.value,
                        string: newValue
                    })
            }
        },
        array: {
            get: function() {
                return (this.input && this.input.array !== undefined ? this.input.array : null)
            },
            set: function(newValue){
                if (!_.isEqual(newValue, this.array))
                    this.$emit('input', {
                        ...this.value,
                        array: newValue.slice(0)
                    })
            }
        },
        subObject: {
            get: function() {
                return (this.value && this.value.subObject !== undefined && _.isObject(this.value.subObject) ? this.value.subObject : null)
            },
            set: function(newValue) {
                if (!_.isEqual(newValue, this.subObject))
                    this.$emit('input', {
                        ...this.value,
                        subObject: JSON.parse(JSON.stringify(newValue))
                    })
            }
        }
    },
    data() {
        return {}
    },
    beforeCreate: function () {
        this.$options.components.EditObject = require('./EditObject.vue').default
    }
}
</script>
