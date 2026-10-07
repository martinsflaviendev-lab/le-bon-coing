<script setup>
import { api } from '@/api'
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// ------------------------------------------------ REFS/INFOS
const userOffers = ref({ data: null })
const userInfos = ref({ data: null })

// ------------------------------------------------ INFOS REQUEST
onMounted(async () => {
  try {
    const { data: userData } = await api.get('/users/me')
    console.log(userData)
    userInfos.value = userData

    const { data: offersData } = await api.get('/offers/infos/mine')
    console.log(offersData)
    userOffers.value = offersData
  } catch (error) {
    console.log(error)
  }
})

// ------------------------------------------------ DELETE OFFERS

// ------------------------------------------------ UPDATE AVATAR

// ------------------------------------------------ DELETE ONE OFFER
const deleteOneOffer = async (id) => {
  console.log(id)
  const response = await api.delete(`offers/${id}`)
  console.log(response)
  alert("l'offre a été supprimée")
  // location.reload()
  router.go()
}
// ------------------------------------------------ DELETE USER

//-------------------------------------------------- DATE FORMATING
const toGoodDate = (date) => {
  return date
    .match(/([^T]+)/)[0]
    .split('-')
    .reverse()
    .join('/')
}
</script>

<template>
  <main>
    <div class="wrapper">
      <div class="userContainer">
        <div v-if="userInfos">
          <h1>{{ userInfos.username }}</h1>
          <h2>{{ userInfos.email }}</h2>
          <img v-if="userInfos.avatar" :src="userInfos.avatar.url" alt="" />
        </div>
      </div>

      <div class="offersContainer" v-if="userOffers.length > 0">
        <div v-for="offer in userOffers" :key="offer.documentId">
          <h2>{{ offer.title }}</h2>
          <p>{{ offer.description }}</p>
          <img v-if="offer.pictures?.length" :src="offer.pictures[0].url" alt="" />
          <p>modifié dernièrement le {{ toGoodDate(offer.updatedAt) }}</p>
          <button @click="deleteOneOffer(offer.documentId)">Supprimer l'offre</button>
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped>
.offersContainer > div > img {
  height: 100px;
  width: 100px;
  object-fit: cover;
}
.userContainer > div > img {
  height: 130px;
  width: 130px;
  object-fit: cover;
}
</style>
