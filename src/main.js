import './assets/main.css'

import { createApp, ref } from 'vue'
import App from './App.vue'
import router from './router'
import VueCookies from 'vue-cookies'

const app = createApp(App)

app.use(router)
app.use(VueCookies, { expires: '1h', secure: true })

//DONE : getting the cookies to initialize the ref
const userToken = ref(VueCookies.get('userToken') || null)
const username = ref(VueCookies.get('username') || null)
const userId = ref(VueCookies.set('userId') || null)
// const searched = ref('') == watchers DEPR

const deleteInfos = () => {
  VueCookies.remove('username')
  VueCookies.remove('userToken')
  VueCookies.remove('userId')
  userToken.value = null
  username.value = null
  userId.value = null
}

app.provide('GlobalStore', {
  userToken: userToken,
  username: username,
  userId: userId,
  //   searched: searched, ==> avec les watchers, voir home et header
  deleteInfos: deleteInfos,
})

app.mount('#app')
