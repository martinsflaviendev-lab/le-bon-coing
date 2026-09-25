<script setup>
import HeaderComp from './components/HeaderComp.vue'
import FooterComp from './components/FooterComp.vue'
import { RouterView } from 'vue-router'
</script>

<template>
  <HeaderComp />
  <RouterView />
  <FooterComp />
</template>

<style scoped></style>
