<template>
    <div>
        <label for="value">Number:</label>
        <input type="number" id="value" name="value" v-model="value">
    </div>
</template>

<script>
export default {
    props: {
        input: {
            type: Number,
            default: null
        }
    },
    data() {
        return {
            value: null
        }
    },
    watch: {
        input(val) {
            this.value = val
        },
        value(val) {
            this.$emit('input', parseFloat(val))
        }
    }
}
</script>
