<script setup>
import { RouterLink } from 'vue-router'
const props = defineProps({
  offer: { type: Object, required: true },
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
  <RouterLink :to="{ name: 'offer', params: { id: props.offer.id } }">
    <div class="cardContainer">
      <div class="author">
        <img
          v-if="props.offer.attributes.owner.data.attributes.avatar.data"
          :src="props.offer.attributes.owner.data.attributes.avatar.data.attributes.url"
          alt=""
        />
        <h3>{{ props.offer.attributes.owner.data.attributes.username }}</h3>
      </div>
      <img
        v-if="props.offer.attributes.pictures.data"
        :src="props.offer.attributes.pictures.data[0].attributes.url"
        alt=""
        class="offerImage"
      />
      <p>{{ props.offer.attributes.title }}</p>
      <h4>{{ props.offer.attributes.price }} €</h4>
      <h4>{{ toGoodDate(props.offer.attributes.publishedAt) }}</h4>
    </div>
  </RouterLink>
</template>

<style scoped>
.cardContainer {
  height: 200px;
  width: 150px;
  border: 1px solid coral;
}

.author {
  display: flex;
}

.author > img {
  height: 35px;
  width: 35px;
  object-fit: cover;
}

.offerImage {
  height: 80px;
  width: 100px;
  object-fit: cover;
}
</style>
