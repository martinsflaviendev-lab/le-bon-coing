<script setup>
import { inject, ref } from 'vue'
import { RouterLink, useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

const GlobalStore = inject('GlobalStore')

const searchedWord = ref('')

const deconnectUser = () => {
  GlobalStore.logout()
}

const handleSearch = () => {
  const queries = { ...route.query }
  queries.search = searchedWord.value
  router.push({ name: 'home', query: queries })
}
</script>

<template>
  <header>
    <RouterLink :to="{ name: 'home' }" class="navigator"><h2>Home</h2></RouterLink>

    <RouterLink :to="{ name: 'publish' }" class="navigator"><h2>Publish</h2></RouterLink>

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

    <RouterLink :to="{ name: 'signup' }" class="navigator"><h2>Signup</h2></RouterLink>

    <RouterLink :to="{ name: 'login' }" class="navigator"><h2>Login</h2></RouterLink>

    <div class="profil">
      <RouterLink :to="{ name: 'user' }">
        <h4>{{ GlobalStore.username.value }}</h4>
      </RouterLink>
      <button @click="deconnectUser">Deconnect</button>
    </div>
  </header>
</template>

<style scoped>
a {
  font-family: 'Nunito Sans Variable', sans-serif;
  font-weight: 600;
  font-style: normal;
  color: black;
  text-decoration: none;
}

.navigator.router-link-active {
  color: white;
}

header {
  border: 1px solid black;
  display: flex;
  justify-content: space-around;
  align-items: center;
  gap: 40px;
  height: 40px;
  background-color: coral;
  position: fixed;
  height: var(--header-height);
  /* ou sticky sans padding */
  top: 0;
  z-index: 100;
  left: 0px;
  top: 0px;
  width: 100%;
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
