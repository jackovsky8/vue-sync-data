<template>
    <div class="column">
        <div class="row">
            <router-link to="/">Test All</router-link>
            <router-link to="/number">Test Number</router-link>
            <router-link to="/boolean">Test Boolean</router-link>
            <router-link to="/string">TestString</router-link>
            <router-link to="/array">Test Array</router-link>
            <router-link to="/object">Test Object</router-link>
        </div>
        <router-view />
    </div>
</template>

<style>
.row {
    display: table;
    width: 100%; /*Optional*/
    table-layout: fixed; /*Optional*/
    border-spacing: 10px; /*Optional*/
}
.row > a {
    margin: 0 10px;
}
.column {
    display: table-cell;
}
</style>
