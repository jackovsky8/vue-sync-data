<template>
  <div>
    <h1>Test Vue-Sync-Data</h1>
    <h5>NUMBER:</h5>
    <div>
        <edit-number v-model="number" />
        <div class="row">
            <button type="button" @click="number=null">To Null</button>
        </div>
        <div class="row">
            <vue-json-pretty :data="number" />
        </div>
    </div>
    <h5>BOOLEAN:</h5>
    <div>
        <edit-boolean v-model="boolean" />
        <div class="row">
            <button type="button" @click="boolean=null">To Null</button>
        </div>
        <div class="row">
            <vue-json-pretty :data="boolean" />
        </div>
    </div>
    <h5>STRING:</h5>
    <div>
        <edit-string v-model="string" />
        <div class="row">
            <button type="button" @click="string=null">To Null</button>
        </div>
        <div class="row">
            <vue-json-pretty :data="string" />
        </div>
    </div>
    <h5>ARRAY:</h5>
        <edit-array v-model="array"/>
        <div class="row">
            <button type="button" @click="array=null">To Null</button>
        </div>
        <div class="row">
            <vue-json-pretty :data="array" />
        </div>
    <h5>OBJECT:</h5>
        <edit-object v-model="object"/>
        <div class="row">
            <button type="button" @click="object=null">To Null</button>
        </div>
        <div class="row">
            <vue-json-pretty :data="object" />
        </div>
  </div>
</template>

<script>
import EditNumber from './components/EditNumber'
import EditBoolean from './components/EditBoolean'
import EditString from './components/EditString'
import EditArray from './components/EditArray'
import EditObject from './components/EditObject'

import VueJsonPretty from 'vue-json-pretty'

export default {
    components: {
        'edit-array': EditArray,
        'edit-object': EditObject,
        'edit-string': EditString,
        'edit-number': EditNumber,
        'edit-boolean': EditBoolean,
        'vue-json-pretty': VueJsonPretty
    },
    data() {
        return {
            number: null,
            boolean: false,
            string: '',
            array: [],
            object: {
                number: null, 
                boolean: null,
                string: null,
                array: [],
                subObject: {
                    number: null,
                    string: null
                }
            }
        }
    },
    syncData: {
        number: {
            name: 'number',
            type: Number
        },
        boolean: {
            name: 'boolean',
            type: Boolean
        },
        string: {
            name: 'string',
            type: String
        },
        array: {
            name: 'array',
            type: Array,
            nullable: false
        },
        object: {
            name: 'object',
            type: Object,
            proto: {
                number: {
                    name: 'number',
                    type: Number,
                    nullable: true
                },
                boolean: {
                    name: 'boolean',
                    type: Boolean,
                    nullable: false
                },
                string: {
                    name: 'string',
                    type: String,
                    nullable: true
                },
                array: {
                    name: 'array',
                    type: Array,
                    nullable: false
                },
                subObject: {
                    name: 'sub',
                    type: Object,
                    nullable: false,
                    proto: {
                        number: {
                            name: 'number',
                            type: Number,
                            nullable: true
                        },
                        string: {
                            name: 'string',
                            type: String,
                            nullable: true
                        }
                    }
                }
            }
        }
    }
}
</script>
