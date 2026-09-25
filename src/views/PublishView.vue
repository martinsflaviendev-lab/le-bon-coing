<script setup>
import axios from 'axios'
import { inject, ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const GlobalStore = inject('GlobalStore')

// INPUTS REFS   __________________________________________✒️
const title = ref('')
const description = ref('')
const price = ref(0)
const pictures = ref([])

// REQUEST REFS  __________________________________________🔎
const isPublishing = ref(false)
const errorMessage = ref('')
const owner = ref(GlobalStore.userId.value)
// To delete whis The strapi V5

//PICTURES HANDLING  ______________________________________📷
const handleFilesChange = (event) => {
  const newFiles = Array.from(event.target.files)

  newFiles.forEach((element) => {
    const alreadyExists = pictures.value.some(
      (picture) =>
        picture.name === element.name &&
        picture.size === element.size &&
        picture.lastModified === element.lastModified,
    )
    if (!alreadyExists) {
      pictures.value.push(element)
    }
  })
}

const removePicture = (index) => {
  pictures.value.splice(index, 1)
}

const getURL = (picture) => {
  return URL.createObjectURL(picture)
}

// REQUEST   _____________________________________________ 🔎
const handleSubmit = async () => {
  isPublishing.value = true
  errorMessage.value = ''

  if (
    title.value &&
    description.value &&
    price.value &&
    pictures.value.length &&
    pictures.value.length <= 10
  ) {
    console.log('begining request')
    try {
      const formData = new FormData()
      pictures.value.forEach((file) => {
        formData.append('files.pictures', file)
      })

      const stringifiedInfos = JSON.stringify({
        title: title.value,
        description: description.value,
        price: price.value,
        owner: owner.value,
      })
      formData.append('data', stringifiedInfos)

      const response = await axios.post(
        'https://site--strapileboncoin--2m8zk47gvydr.code.run/api/offers',
        formData,
        {
          headers: {
            Authorization: 'Bearer ' + GlobalStore.userToken.value,
          },
        },
      )

      console.log('response>>', response.data)
      alert('publication réussie')

      router.push({ name: 'offer', params: { id: response.data.data.id } })
    } catch (error) {
      console.log(error)
      errorMessage.value = error.response.data
    }
  } else {
    console.log('request failed')
  }
  isPublishing.value = false
}
</script>

<!-- ====================================================================== -->
<template>
  <main>
    <div class="animContainer" v-if="isPublishing">
      <p>Publication de l'annonce en cours</p>
      <div class="publishing"></div>
    </div>

    <div class="container">
      <!-- FORM -->
      <form @submit.prevent="handleSubmit">
        <label for="title">Titre:</label>
        <input type="text" name="title" id="title" placeholder="title" v-model="title" />

        <label for="description">description:</label>
        <textarea
          name="description"
          id="description"
          cols="100"
          rows="20"
          placeholder="description"
          v-model="description"
        ></textarea>

        <label for="price">Prix: </label>
        <input type="number" name="price" id="price" v-model="price" pattern="[0-9]*" />

        <label for="pictures">Ajoutez vos photos</label>
        <input
          type="file"
          name="pictures"
          id="pictures"
          multiple
          accept="image/*"
          @change="handleFilesChange"
        />
        <button>Publier l'offre</button>
      </form>

      <!-- Previsualisation -->
      <div clas="previsualisation" v-if="pictures.length">
        <div v-for="(file, index) in pictures" :key="file.name + file.lastModified">
          <h4>{{ file.name }}</h4>
          <img :src="getURL(file)" />
          <button @click="removePicture(index)">X</button>
        </div>
      </div>
    </div>
  </main>
</template>

<!-- ========================================================================== -->
<style scoped>
input[type='number'] {
  appearance: textfield;
  -moz-appearance: textfield;
}
input[type='number']::-webkit-outer-spin-button,
input[type='number']::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

img {
  width: 100px;
  height: 100px;
  object-fit: cover;
}

.animContainer {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 30px;
}

.publishing {
  /* margin: auto; */
  border: 10px solid grey;
  border-radius: 50%;
  border-top: 10px solid coral;
  width: 40px;
  height: 40px;
  animation: spinner 2s linear infinite;
}
@keyframes spinner {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
