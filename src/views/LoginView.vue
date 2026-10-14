<script setup>
import { RouterLink, useRouter, useRoute } from 'vue-router'
import { api, setToken, getToken } from '@/api'
import { ref, inject } from 'vue'
import CardAnimation from '@/components/CardAnimation.vue'

const router = useRouter()
const route = useRoute()

//-------------------------------------------------- STORE
const GlobalStore = inject('GlobalStore')

//-------------------------------------------------- INPUTS
const identifier = ref('')
const password = ref('')

//-------------------------------------------------- ERRORS
const isCorrect = ref(true)
const isError = ref(false)
const errorMessage = ref('')

//-------------------------------------------------- ASYNCS ALERTS
const isSubmitting = ref(false)

//-------------------------------------------------- RESQUEST
const handleSignin = async () => {
  isCorrect.value = true
  isError.value = false
  isSubmitting.value = true

  if (identifier.value && password.value) {
    try {
      console.log('handling login')
      // ------------------------------------ request
      const response = await api.post('/auth/local', {
        identifier: identifier.value,
        password: password.value,
      })

      // Stocking the username and token
      setToken(response.data.jwt)
      GlobalStore.username.value = response.data.user.username

      alert('connexion réussie !')

      console.log(response)
      console.log('the token to compare ====> ', getToken())

      router.push(route.query.redirect || { name: 'home' })
    } catch (error) {
      isError.value = true
      errorMessage.value = error.response?.data?.error?.message || 'Une erreur est survenue'
      console.log(error.response?.data)
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
      <div class="loginForm">
        <h1>connectez-vous pour découvrir toutes nos fonctionnalités.</h1>
        <div class="formWrapper">
          <form @submit.prevent="handleSignin">
            <label for="identifier">Nom*</label>
            <div>
              <input
                type="text"
                name="identifier"
                id="identifier"
                placeholder="votre nom d'utilisateur"
                v-model="identifier"
              />
            </div>
            <div>
              <label for="password">Mot de passe* </label>
              <input
                type="password"
                name="password"
                id="password"
                placeholder="votre mot de passe"
                v-model="password"
              />
            </div>

            <button>Se connecter</button>
            <div>
              <p>
                Pas encore inscrit ?
                <RouterLink :to="{ name: 'signup' }">Inscrivez vous</RouterLink>
              </p>
            </div>
          </form>
        </div>

        <p class="warning" v-if="isSubmitting">Connexion en cours</p>
        <p class="warning" v-if="errorMessage">{{ errorMessage }}</p>
        <p class="warning" v-if="!isCorrect">Veuillez remplir tous les champs obligatoires</p>
      </div>
    </div>
    <CardAnimation />
  </main>
</template>

<style scoped>
main {
  display: flex;
  justify-content: space-around;
  margin-top: 20px;
}
.loginContainer {
  height: 100%;
  display: flex;
  align-items: center;
  margin-left: 30px;
  flex: 1;
  max-width: 500px;
}

.loginForm {
  margin-top: 30px;
}

.loginForm > h1 {
  font-size: 25px;
  font-weight: 600;
}

.formWrapper {
  width: 100%;
  display: flex;
  justify-content: center;
}

form {
  margin: 20px 0px;
  display: flex;
  flex-direction: column;
  width: 350px;
  gap: 20px;
  align-items: center;
}

form label {
  font-size: 18px;
}

input,
button {
  margin-top: 5px;
  height: 50px;
  width: 380px;
  align-self: center;
  font-size: 16px;
}

input {
  box-sizing: border-box;
  padding-left: 15px;
  border: 1px solid grey;
  border-radius: 35px;
}

button {
  border: none;
  border-radius: 35px;
  background-color: var(--main-bckg-color);
  font-weight: 600;
  color: white;
}
button:hover {
  background-color: var(--hover-main-button-bckg-color);
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
