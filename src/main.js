import './assets/main.css'

import { createApp, ref } from 'vue'
import App from './App.vue'
import router from './router'
import { api, restoreSession, logout as apiLogout } from './api'

const username = ref('null')

async function starting() {
  const restored = await restoreSession()

  if (restored) {
    try {
      const { data } = await api.get('/user/me')
      username.value = data.username
    } catch {
      username.value = null
    }
  }

  const app = createApp(App)
  app.use(router)

  const logout = async () => {
    await apiLogout()
    username.value = null
  }

  app.provide('GlobalStore', {
    username,
    logout,
  })

  app.mount('#app')
}

starting()

// FIRST VERSION NOW BROKEN

// import './assets/main.css'

// import { createApp, ref } from 'vue'
// import App from './App.vue'
// import router from './router'
// import VueCookies from 'vue-cookies'

// const app = createApp(App)

// app.use(router)
// app.use(VueCookies, { expires: '1h', secure: true })

// //DONE : getting the cookies to initialize the ref
// const userToken = ref(VueCookies.get('userToken') || null)
// const username = ref(VueCookies.get('username') || null)
// const userId = ref(VueCookies.set('userId') || null)
// // const searched = ref('') == watchers DEPR

// const deleteInfos = () => {
//   VueCookies.remove('username')
//   VueCookies.remove('userToken')
//   VueCookies.remove('userId')
//   userToken.value = null
//   username.value = null
//   userId.value = null
// }

// app.provide('GlobalStore', {
//   userToken: userToken,
//   username: username,
//   userId: userId,
//   //   searched: searched, ==> avec les watchers, voir home et header
//   deleteInfos: deleteInfos,
// })

// app.mount('#app')
