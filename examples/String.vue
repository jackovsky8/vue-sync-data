<template>
  <div>
    <h1>Test Vue-Sync-Data String</h1>
    <h5>NUMBER:</h5>
    <div>
        <label for="number">Value: {{ number === null ? 'null' : number }}</label>
        <input type="number" id="number" name="number" v-model="number">
    </div>
    <h5>BOOLEAN:</h5>
    <div>
        <label for="boolean">Value: {{ boolean ? 'true' : 'false' }}</label>
        <input type="checkbox" id="boolean" name="boolean" v-model="boolean">
    </div>
    <h5>STRING:</h5>
    <div>
        <label for="string">Value: {{ string === null ? 'null' : string }}</label>
        <input type="text" id="string" name="string" v-model="string">
    </div>
    <h5>ARRAY:</h5>
    <h5>OBJECT:</h5>
  </div>
</template>

<script>
export default {
    data() {
        return {
            number: null,
            boolean: false,
            string: ''
        }
    },
    syncData: {
        string: {
            name: 'string',
            type: String
        },
        number: {
            name: 'number',
            type: Number
        },
        boolean: {
            name: 'boolean',
            type: Boolean
        }
    }
}
</script>
