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

console.log(props.offer)
</script>

<template>
  <RouterLink :to="{ name: 'offer', params: { id: props.offer.documentId } }">
    <div class="cardContainer">
      <div class="author">
        <img v-if="props.offer.owner?.avatar" :src="props.offer.owner.avatar.url" alt="" />
        <h3>{{ props.offer.owner.username }}</h3>
      </div>
      <img
        v-if="props.offer.pictures?.length"
        :src="props.offer.pictures[0].url"
        alt=""
        class="offerImage"
      />
      <p>{{ props.offer.title }}</p>
      <h4>{{ props.offer.price }} €</h4>
      <h4>{{ toGoodDate(props.offer.publishedAt) }}</h4>
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
