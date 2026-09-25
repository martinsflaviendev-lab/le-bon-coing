<script setup>
import { onMounted, ref } from 'vue'
import axios from 'axios'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const offerInfo = ref({ data: null })

const props = defineProps({
  id: { required: true },
})

onMounted(async () => {
  try {
    const { data } = await axios.get(
      `https://site--strapileboncoin--2m8zk47gvydr.code.run/api/offers/${props.id}?populate[0]=pictures&populate[1]=owner.avatar.data`,
    )
    console.log(data)
    offerInfo.value = data
  } catch (err) {
    console.log(err)
  }
})

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
      <!-- Offer -->

      <div v-if="offerInfo.data" class="offerContainer">
        <div class="imageContainer">
          <img
            v-for="(el, index) in offerInfo.data.attributes.pictures.data"
            :key="index"
            :src="offerInfo.data.attributes.pictures.data[index].attributes.url"
            alt=""
          />
        </div>

        <h3>{{ offerInfo.data.attributes.title }}</h3>
        <p>{{ offerInfo.data.attributes.price }} €</p>
        <p>{{ toGoodDate(offerInfo.data.attributes.publishedAt) }}</p>

        <div class="description">
          <h2>Description</h2>
          <p>{{ offerInfo.data.attributes.description }}</p>
        </div>
        <p>Agon-coutainville (50230)</p>
      </div>
      <div v-else class="loading">
        <p>Chargement</p>
      </div>

      <!-- Owner -->
      <div v-if="offerInfo.data" class="ownerContainer">
        <div>
          <div class="owner">
            <img
              v-if="offerInfo.data.attributes.owner.data.attributes.avatar.data"
              :src="offerInfo.data.attributes.owner.data.attributes.avatar.data.attributes.url"
              alt=""
            />
            <h2>{{ offerInfo.data.attributes.owner.data.attributes.username }}</h2>
          </div>
          <span v-if="offerInfo.data.attributes.owner.data.attributes.confirmed === true"
            >Pièce d'identité vérifiée</span
          >
          <p>Répond en général en moins d'1 heure</p>
        </div>

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
