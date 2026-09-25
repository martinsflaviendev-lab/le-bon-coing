<script setup>
import { inject, ref } from 'vue'
import { RouterLink, useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

const GlobalStore = inject('GlobalStore')

const searchedWord = ref('')

const deconnectUser = () => {
  GlobalStore.deleteInfos()
}

const handleSearch = () => {
  const queries = { ...route.query }
  queries.search = searchedWord.value
  router.push({ name: 'home', query: queries })
}
</script>

<template>
  <header>
    <RouterLink :to="{ name: 'home' }"><h2>Home</h2></RouterLink>

    <RouterLink :to="{ name: 'publish' }"><h2>Publish</h2></RouterLink>

    <form @submit.prevent="handleSearch" class="searchBar">
      <input
        type="text"
        name="search"
        id="search"
        v-model="searchedWord"
        placeholder="Rechercher"
      />
      <button class="searchcube" type="submit">🔎</button>
    </form>

    <RouterLink :to="{ name: 'signup' }"><h2>Signup</h2></RouterLink>

    <RouterLink :to="{ name: 'login' }"><h2>Login</h2></RouterLink>
    <div class="profil">
      <h4>{{ GlobalStore.username.value }}</h4>
      <button @click="deconnectUser">Deconnect</button>
    </div>
  </header>
</template>

<style scoped>
header {
  border: 1px solid black;
  display: flex;
  justify-content: center;
  gap: 40px;
}

.profil {
  display: flex;
  gap: 20px;
}

header > div > button {
  width: 80px;
}

.searchBar {
  display: flex;
  height: 30px;
}
.searchBar > button {
  border: none;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 30px;
  background-color: coral;
}
</style>
