<template>
    <div>
        <label for="value">String:</label>
        <input type="text" id="value" name="value" v-model="value">
    </div>
</template>

<script>
export default {
    props: {
        input: {
            type: String,
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
            this.$emit('input', val)
        }
    }
}
</script>
