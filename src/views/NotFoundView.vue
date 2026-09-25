<script>
import { RouterLink } from 'vue-router'
</script>

<template>
  <main>
    <h1>Désolé, cette page n'existe pas.</h1>

    <RouterLink :to="{ name: 'home' }">Retourner à la page d'accueil</RouterLink>
  </main>
</template>
