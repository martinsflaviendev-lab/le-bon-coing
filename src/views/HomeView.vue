<script setup>
import axios from 'axios'
import { inject, onMounted, ref, watchEffect } from 'vue'
import { useRouter } from 'vue-router'
import OfferCard from '@/components/OfferCard.vue'

const router = useRouter()

const props = defineProps({
  min: Number,
  max: Number,
  sort: Number,
  search: String,
  page: Number,
})

const GlobalStore = inject('GlobalStore')
const offersList = ref([])

// Filters refs
const minPrice = ref(0)
const maxPrice = ref(100000)
const sortingType = ref(0)
const numberOfPages = ref(1)

// const filterSearch = ref(GlobalStore.searched.value || '') ==> avec le watcher

// // watchers functions ==> pas la solution mais intéressant
// watch(
//   () => GlobalStore.searched.value,
//   (Value) => {
//     filterSearch.value = Value
//     console.log(`the value checked is ${filterSearch.value}`)
//   },
// )

onMounted(() => {
  watchEffect(async () => {
    // const sortingByPrice = (value) => {
    //   if (value === 1) {
    //     return '&sort[0]=price:asc'
    //   } else if (value === 2) {
    //     return '&sort[0]=price:desc'
    //   } else {
    //     return ''
    //   }
    // }

    const params = {
      'pagination[page]': props.page,
      'pagination[pageSize]': 10,
      'populate[0]': 'pictures',
      'populate[1]': 'owner.avatar.data',
      'filters[title][$containsi]': props.search,
      'filters[price][$lte]': props.max,
      'filters[price][$gte]': props.min,
    }

    const sortMap = {
      1: 'price:asc',
      2: 'price:desc',
    }

    if (sortMap[props.sort]) {
      params['sort[0]'] = sortMap[props.sort]
    }

    try {
      // const { data } = await axios.get(
      //   `https://site--strapileboncoin--2m8zk47gvydr.code.run/api/offers?populate[0]=pictures&populate[1]=owner.avatar.data&filters[title][$containsi]=${props.search}&filters[price][$lte]=${props.max}&filters[price][$gte]=${props.min}${sortingByPrice(props.sort)}`,
      // )

      const { data } = await axios.get(
        'https://site--strapileboncoin--2m8zk47gvydr.code.run/api/offers',
        { params },
      )

      console.log(data)
      offersList.value = data.data
      numberOfPages.value = data.meta.pagination.pageCount
    } catch (err) {
      console.log(err)
    }
  })
})

// event functions
const handleFilters = () => {
  const queries = { ...props }

  //TODO il faudra implémenter une vérification et un delete des queries ici
  queries.min = minPrice.value
  queries.max = maxPrice.value
  queries.sort = sortingType.value
  queries.page = 1

  router.push({ name: 'home', query: queries })
}

const nextPage = () => {
  const queries = { ...props }
  queries.page = queries.page + 1
  router.push({ name: 'home', query: queries })
}

const previousPage = () => {
  const queries = { ...props }
  queries.page = queries.page - 1
  router.push({ name: 'home', query: queries })
}
</script>

<template>
  <main>
    <div class="container">
      <form class="filterBar" @submit.prevent="handleFilters">
        <div class="price">
          <h2>Prix</h2>
          <div>
            <input
              type="number"
              min="0"
              pattern="[0-9]*"
              placeholder="Prix min"
              id="minprice"
              v-model="minPrice"
            />
            <input
              type="number"
              min="0"
              pattern="[0-9]*"
              placeholder="Prix max"
              id="maxprice"
              v-model="maxPrice"
            />
          </div>
        </div>

        <div class="sorting">
          <h2>Tri</h2>

          <div class="buttonsSort">
            <label for="ascending"
              ><input
                type="radio"
                name="sortingType"
                id="ascending"
                :value="1"
                v-model="sortingType"
              />prix croissant</label
            >

            <label for="descending">
              <input
                type="radio"
                name="sortingType"
                id="descending"
                :value="2"
                v-model="sortingType"
              />prix décroissant</label
            >

            <label for="noSort"
              ><input
                type="radio"
                name="sortingType"
                id="noSort"
                :value="0"
                v-model="sortingType"
              />pas de tri</label
            >
          </div>
        </div>

        <button>Rechercher</button>
      </form>

      <p class="annonce">
        Des millions de petites annonces et autant d'occasions de se faire plaisir
      </p>

      <div class="banner">
        <h2>C'est le momment de vendre</h2>
        <button>Déposer une annonce</button>
      </div>

      <p v-if="offersList.length === 0">chargement</p>

      <div v-else class="offersContainer">
        <OfferCard v-for="offer in offersList" :key="offer.id" :offer="offer" />
      </div>

      <div class="changePages">
        <button v-if="page > 1" @click="previousPage">Page précédente</button>
        <button v-if="page < numberOfPages" @click="nextPage">Page suivante</button>
      </div>
    </div>
  </main>
</template>

<style scoped>
.container {
  margin: 20px auto;
  display: flex;
  flex-direction: column;
  width: 1200px;
  justify-content: center;
}

.offersContainer {
  display: flex;
  flex-wrap: wrap;
  width: 1200px;
  justify-content: space-between;
  gap: 30px;
  margin-top: 30px;
}

.banner {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
  height: 35px;
  background-color: coral;
  padding: 15px 20px;
}

.filterBar {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin: 30px 0px;
}

.price {
  display: flex;
  flex-direction: column;
}

.sorting {
  display: flex;
  flex-direction: column;
}

.price > div {
  display: flex;
  flex-direction: row;
}

input {
  max-width: 80px;
}

input[type='number'] {
  appearance: textfield;
}

@media (max-width: 1200px) {
  .container,
  .offersContainer {
    width: 900px;
  }
}

@media (max-width: 1024px) {
  .container,
  .offersContainer {
    width: 800px;
  }
}
</style>
