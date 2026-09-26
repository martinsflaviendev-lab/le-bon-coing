<script setup>
import { onMounted, ref } from 'vue'
import { api } from '@/api'
import { useRoute, useRouter } from 'vue-router'

//-------------------------------------------------- ROUTING
const route = useRoute()
const router = useRouter()

//-------------------------------------------------- INFOS
const offerInfo = ref({ data: null })

const props = defineProps({
  id: { required: true },
})

//-------------------------------------------------- REQUEST
onMounted(async () => {
  try {
    const { data } = await api.get(`/offers/${props.id}`)
    console.log(data)
    offerInfo.value = data
  } catch (err) {
    console.log(err)
  }
})

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
    <p>TEST ONE OFFER VIEW</p>

    <div class="container">
      <!-- ======================================== OFFER -->
      <div v-if="offerInfo.data" class="offerContainer">
        <div class="imageContainer">
          <img
            v-for="(picture, index) in offerInfo.data.pictures"
            :key="picture.id"
            :src="picture.url"
            alt=""
          />
        </div>

        <h3>{{ offerInfo.data.title }}</h3>
        <p>{{ offerInfo.data.price }} €</p>
        <p>{{ toGoodDate(offerInfo.data.publishedAt) }}</p>

        <div class="description">
          <h2>Description</h2>
          <p>{{ offerInfo.data.description }}</p>
        </div>
        <p>Agon-coutainville (50230)</p>
      </div>
      <div v-else class="loading">
        <p>Chargement</p>
      </div>

      <!-- ======================================== OWNER -->
      <div v-if="offerInfo.data" class="ownerContainer">
        <div>
          <div class="owner">
            <img v-if="offerInfo.data.owner.avatar" :src="offerInfo.data.owner.avatar.url" alt="" />
            <h2>{{ offerInfo.data.owner.username }}</h2>
          </div>
          <span v-if="offerInfo.data.owner.confirmed === true">Pièce d'identité vérifiée</span>
          <p>Répond en général en moins d'1 heure</p>
        </div>
        <!-- ======================= BUY -->
        <div class="buttons">
          <button @click="router.push({ name: 'buy', params: { id: props.id } })">Acheter</button>
          <button>Message</button>
        </div>
      </div>
      <div v-else class="loading">
        <p>Chargement</p>
      </div>
    </div>
  </main>
</template>

<style scoped>
.container {
  max-width: 1200px;
  display: flex;
  margin: 40px auto;
}

.imageContainer {
  width: 600px;
  display: flex;
  gap: 20px;
  overflow-x: scroll;
}

img {
  width: 400px;
  height: 400px;
  object-fit: cover;
}

.offerContainer {
  max-width: 700px;
  display: flex;
  flex-direction: column;
}

.description {
  border-top: 2px solid gray;
  border-bottom: 2px solid gray;
}

/* OWNER */

.owner > img {
  width: 50px;
  height: 50px;
  object-fit: cover;
  border-radius: 50%;
}
</style>
