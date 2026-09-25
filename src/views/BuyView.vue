<script setup>
import { computed, onMounted, ref, inject } from 'vue'
import axios from 'axios'
import { loadStripe } from '@stripe/stripe-js'

const stripePromise = loadStripe(
  'pk_test_51HCObyDVswqktOkX6VVcoA7V2sjOJCUB4FBt3EOiAdSz5vWudpWxwcSY8z2feWXBq6lwMgAb5IVZZ1p84ntLq03H00LDVc2RwP',
)
const cardElement = ref(null)

const GlobalStore = inject('GlobalStore')
const offerInfo = ref({ data: null })
const props = defineProps({
  id: { required: true },
})

const offer = computed(() => offerInfo.value?.data?.attributes ?? null)
const deliveryPrice = ref(0)
const firstname = ref(null)
const lastname = ref(null)
const telNumber = ref(null)

const totalAmount = computed(() => (offer.value?.price ?? 0) + deliveryPrice.value)

onMounted(async () => {
  try {
    const { data } = await axios.get(
      `https://site--strapileboncoin--2m8zk47gvydr.code.run/api/offers/${props.id}?populate[0]=pictures&populate[1]=owner.avatar`,
    )
    console.log(data)
    offerInfo.value = data
  } catch (err) {
    console.log(err)
  }

  const stripe = await stripePromise
  const elements = stripe.elements()

  cardElement.value = elements.create('card', {
    style: {
      base: {
        fontSize: '12px',
        fontFamily: 'Arial, Haettenschweiler',
        color: 'black',
        '::placeholder': {
          color: 'coral',
        },
        iconColor: 'aqua',
      },
      invalid: {
        color: 'red',
        iconColor: 'red',
      },
    },
  })

  cardElement.value.mount('#card-element')
})

const handlePayement = async () => {
  if (offer.value && firstname.value && lastname.value) {
    const stripe = await stripePromise
    const { token } = await stripe.createToken(cardElement.value)
    const stripeToken = token.id
    const body = {
      title: offer.value.title,
      amount: totalAmount.value,
      token: stripeToken,
    }
    try {
      const response = await axios.post(
        'https://site--strapileboncoin--2m8zk47gvydr.code.run/api/offers/buy',
        body,
        {
          headers: {
            Authorization: 'Bearer ' + GlobalStore.userToken.value,
          },
        },
      )

      console.log(response)
      if (response.status === 201) {
        alert('paiement accepté')
      } else {
        alert('une erreur a empêché le paiment')
      }
    } catch (error) {
      console.log(error)
    }
  }
}
</script>

<template>
  <main>
    <div class="payContainer">
      <!-- =========== Infos personnelles -->
      <div class="infos">
        <h2>Informations personnelles</h2>
        <form>
          <label for="firstname">Prénom</label>
          <input
            type="text"
            name="firstname"
            id="firstname"
            placeholder="firstname"
            v-model="firstname"
          />
          <label for="lastname">Nom</label>
          <input
            type="text"
            name="lastname"
            id="lastname"
            placeholder="lastname"
            v-model="lastname"
          />
          <label for="tel">Téléphone</label>
          <input type="tel" name="tel" id="tel" v-model="telNumber" />
        </form>
      </div>

      <div>
        <h2>Coordonnées bancaires</h2>
        <div id="card-element"></div>
        <button vif="offer" @click="handlePayement">Payer</button>
      </div>
    </div>

    <div class="delivery" v-if="offer">
      <h2>Produit: {{ offer.title }}</h2>
      <img
        v-if="offer.pictures.data[0].attributes.url"
        :src="offer.pictures.data[0].attributes.url"
        alt=""
      />
      <h2>Prix à payer: {{ totalAmount }} €</h2>
      <div>
        <div>
          <h3>Remise en main propre</h3>
          <label>
            <input type="radio" :value="0" v-model="deliveryPrice" />
            Gratuit
          </label>
          <p>Payez et venez récupérer votre achat chez le vendeur</p>
        </div>
        <div>
          <label>
            <h3>Colissimo</h3>
            <input type="radio" :value="15" v-model="deliveryPrice" />
            15 €
          </label>
          <p>à votre domicile sous 3-4 jours ouvrés</p>
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped>
.delivery > img {
  width: 100px;
  height: 100px;
  object-fit: cover;
}
#card-element {
  display: flex;
  flex-direction: column;
  width: 500px;
}
</style>
