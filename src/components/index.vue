<template>
    <button @click="autoCodeReview" class="btn">auto code review</button>
</template>

<script setup>
import { autoCodeReview } from '../apis/hotspots';
</script>

<style scoped>
.btn {
    background-color: #4CAF50;
    /* Green */
    border: none;
    color: white;
    padding: 15px 32px;
    text-align: center;
    text-decoration: none;
    display: inline-block;
    font-size: 16px;
    margin: 4px 2px;
    cursor: pointer;
    border-radius: 12px;
    width: 1000px;
    height: 200px;
    font-size: 40px;
}
</style>