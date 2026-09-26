<script setup>
import { computed, onMounted, ref, inject } from 'vue'
import { api } from '@/api'
import { loadStripe } from '@stripe/stripe-js'

//  -----------------------------------------------STRIPE INIT
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY)
const cardElement = ref(null)
const stripeLoadError = ref(false)
// ------------------------------------------------INFOS
const offerInfo = ref({ data: null })
const props = defineProps({
  id: { required: true },
})
const offer = computed(() => offerInfo.value?.data ?? null)

// ------------------------------------------------ INPUTS
const shipping = ref('normal')
const shippingCost = computed(() => {
  if (shipping.value === 'colissimo') {
    return 10
  } else {
    return 0
  }
})
const totalAmount = computed(() => {
  return shippingCost.value + (offer.value?.price ?? 10)
})

const firstname = ref(null)
const lastname = ref(null)
const telNumber = ref(null)
//  these 3 refs are here for a recap page that I didn't do yet. Maybe a collection commands tied to the users

// ------------------------------------ OFFER REQUEST/ STRIPE INIT
onMounted(async () => {
  // --------------------------- offer data request
  try {
    const { data } = await api.get(`/offers/${props.id}`)
    console.log(data)
    offerInfo.value = data
  } catch (err) {
    console.log(err)
  }
  //  -------------------------- Stripe promise
  try {
    const stripe = await stripePromise
    if (!stripe) throw new Error('Stripe failed to load')

    // --------------------------- stripe element mounting
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
  } catch (error) {
    console.log(error)
    stripeLoadError.value = true
  }
})

// ----------------------------------------------- PAYMENT REQUEST

const handlePayement = async () => {
  if (offer.value && firstname.value && lastname.value) {
    // ------------------------------ stripe part
    const stripe = await stripePromise
    const { token } = await stripe.createToken(cardElement.value)
    const stripeToken = token.id
    // ------------------------------ body part
    const body = {
      documentId: offer.value.documentId,
      token: stripeToken,
      shipping: shipping.value,
    }

    try {
      const response = await api.post('/offers/buy', body)

      console.log(response)
      if (response.status === 200 && response.data.status === 'succeeded') {
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
      <!-- ============================================== STRIPE CARD -->
      <div>
        <h2>Coordonnées bancaires</h2>
        <div id="card-element"></div>
        <button vif="offer" @click="handlePayement">Payer</button>
      </div>
    </div>
    <!-- ============================================= DELIVERY -->
    <div class="delivery" v-if="offer">
      <h2>Produit: {{ offer.title }}</h2>
      <img v-if="offer.pictures?.length" :src="offer.pictures[0].url" alt="" />
      <h2>Prix à payer: {{ totalAmount }} €</h2>
      <div>
        <div>
          <h3>Remise en main propre</h3>
          <label>
            <input type="radio" value="normal" v-model="shipping" />
            Gratuit
          </label>
          <p>Payez et venez récupérer votre achat chez le vendeur</p>
        </div>
        <div>
          <label>
            <h3>Colissimo</h3>
            <input type="radio" value="colissimo" v-model="shipping" />
            10 €
          </label>
          <p>à votre domicile sous 3-4 jours ouvrés</p>
        </div>
      </div>
    </div>
    <div v-if="stripeLoadError" class="warning">
      <p>
        Le formulaire de paiement n'a pas pu se charger. Veuillez vérifier que votre navigateur
        n'ampêche pas les scripts de stripe (protection anti-pistage) et recheargez la page.
      </p>
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
