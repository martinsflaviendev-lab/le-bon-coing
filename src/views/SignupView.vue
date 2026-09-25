<script setup>
import axios from 'axios'
import { inject, ref } from 'vue'

const GlobalStore = inject('GlobalStore')

const email = ref('')
const username = ref('')
const password = ref('')

const isCorrect = ref(true)
const isError = ref(false)
const errorMessage = ref('')

const isSubmitting = ref(false)

const handleSignin = async () => {
  isError.value = false
  isSubmitting.value = true
  isCorrect.value = true

  if (email.value && username.value && password.value) {
    try {
      console.log('handling sign up')

      const response = await axios.post(
        'https://site--strapileboncoin--2m8zk47gvydr.code.run/api/auth/local/register',
        {
          email: email.value,
          username: username.value,
          password: password.value,
        },
      )

      GlobalStore.userToken.value = response.data.jwt
      GlobalStore.username.value = response.data.user.username
      // cookies setting --> username and user token NOTDONE
      $cookies.set('username', response.data.user.username)
      $cookies.set('userToken', response.data.jwt)
      //  ‼️en double avec Login View : créer une fonction directement dedans qui fera ça authaumatiquement avec la donnée de la réponse‼️

      alert('enregistrement réussi !')

      console.log(response)
    } catch (error) {
      console.log(error)
      console.log(error.response.data.error)
      isError.value = true
      errorMessage.value = error.response.data.error.message
    }
  } else {
    isCorrect.value = false
    console.log(`is Correct : ${isCorrect.value}`)
  }

  isSubmitting.value = false
}
</script>

<template>
  <main>
    <div class="loginContainer">
      <h1>Bonjour</h1>
      <p>Inscrivez-vous pour découvrir toutes les fonctionalités.</p>

      <form @submit.prevent="handleSignin">
        <label for="email">E-maill*</label>
        <input type="text" name="email" id="email" placeholder="votre e-mail" v-model="email" />

        <label for="username">Nom*</label>
        <input
          type="text"
          name="username"
          id="username"
          placeholder="votre nom d'utilisateur"
          v-model="username"
        />

        <label for="password">Mot de passe* </label>
        <input
          type="text"
          name="password"
          id="password"
          placeholder="votre mot de passe"
          v-model="password"
        />

        <button>S'enregistrer</button>
      </form>
      <p class="warning" v-if="isSubmitting">Enregistrement en cours</p>
      <p class="warning" v-if="errorMessage">{{ errorMessage }}</p>
      <p class="warning" v-if="!isCorrect">Veuillz remplir tous les champs obligatoires</p>
    </div>
  </main>
</template>

<style scoped>
form {
  display: flex;
  flex-direction: column;
  width: 350px;
}

input,
button {
  width: 300px;
  align-self: center;
}

footer {
  display: flex;
  justify-content: center;
  margin-top: 30px;
}

.warning {
  color: red;
}
</style>
