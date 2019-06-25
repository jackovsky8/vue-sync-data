<template>
  <div>
    <h1>Test Vue-Sync-Data Number</h1>
    <h5>NUMBER:</h5>
    <div>
        <label for="number">Value: {{ number === null ? 'null' : number }}</label>
        <input type="number" id="number" name="number" v-model="number">
    </div>
  </div>
</template>

<script>
export default {
    data() {
        return {
            number: null
        }
    },
    syncData: {
        number: {
            name: 'number',
            type: Number
        }
    }
}
</script>
