<template>
    <div>
        <label for="value">Boolean:</label>
        <input type="checkbox" id="value" name="value" v-model="value">
    </div>
</template>

<script>
export default {
    props: {
        input: {
            type: Boolean,
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
            this.$emit('input', !!val)
        }
    }
}
</script>
