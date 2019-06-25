<template>
    <div>
        <label for="string">New Entry (add with Enter):</label>
        <input type="text" id="string" name="string" v-model="string" @keydown.enter="add">
        <span>Array:</span>
        <ul>
            <li v-for="(item, key) in array" :key="key">{{ item }}</li>
        </ul>
    </div>
</template>

<script>
export default {
    props: {
        input: {
            type: Array,
            default() { return [] }
        }
    },
    data() {
        return {
            array: [],
            string: ''
        }
    },
    watch: {
        input(val) {
            this.array = val.slice(0)
        },
        array(val) {
            this.$emit('input', val.slice(0))
        }
    },
    methods: {
        add() {
            if(this.string && this.string.length>0)
                this.array.push(this.string)
            this.string = ''
        }
    },
}
</script>
