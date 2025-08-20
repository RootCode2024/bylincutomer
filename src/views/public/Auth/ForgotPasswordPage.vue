<template>
  <div class="min-h-screen flex flex-col md:flex-row bg-gray-50">
    <!-- Section illustration -->
    <div class="hidden md:flex flex-1 bg-gradient-to-br from-indigo-600 to-purple-600 relative overflow-hidden">
      <div class="absolute inset-0 flex items-center justify-center p-12">
        <img 
          src="@/assets/images/otp.svg" 
          alt="OTP illustration" 
          class="w-full max-w-md object-contain filter drop-shadow-xl"
        >
      </div>
    </div>

    <!-- Section formulaire -->
    <div class="flex-1 flex items-center justify-center p-6 sm:p-12">
      <div class="w-full max-w-md space-y-8">
        <div class="text-center">
          <router-link to="/" class="inline-block mb-6">
            <img src="@/assets/images/logo.png" alt="Logo" class="h-10 mx-auto">
          </router-link>
          <h1 class="text-3xl font-bold text-gray-900">
            {{ step === 1 ? 'Réinitialisation de mot de passe' : 'Vérification OTP' }}
          </h1>
          <p class="mt-2 text-gray-600">
            {{ step === 1 
              ? 'Entrez votre email pour recevoir un code de vérification' 
              : `Entrez le code envoyé à ${maskedEmail}` }}
          </p>
        </div>

        <!-- Étape 1 : Demande d'email -->
        <form v-if="step === 1" @submit.prevent="sendOtp" class="mt-8 space-y-6">
          <div class="space-y-4">
            <div class="relative">
              <input
                type="email"
                v-model="email"
                required
                class="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                placeholder="Adresse email"
                :class="{ 'border-red-500': errors.email }"
              >
              <div v-if="errors.email" class="mt-1 text-xs text-red-500">
                {{ errors.email }}
              </div>
            </div>
          </div>

          <button 
            type="submit" 
            :disabled="loading || !email"
            class="w-full flex justify-center py-3.5 px-4 rounded-lg shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 transition-all duration-200 disabled:opacity-70"
          >
            <span v-if="!loading">Envoyer le code</span>
            <svg v-else class="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">...</svg>
          </button>
        </form>

        <!-- Étape 2 : Validation OTP -->
        <form v-else @submit.prevent="verifyOtp" class="mt-8 space-y-6">
          <div class="space-y-4">
            <!-- Champ OTP -->
            <div class="flex justify-center space-x-3">
              <input
                v-for="(digit, index) in otpDigits"
                :key="index"
                v-model="otpDigits[index]"
                type="text"
                maxlength="1"
                inputmode="numeric"
                pattern="[0-9]*"
                class="w-12 h-12 text-2xl text-center border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                @input="handleOtpInput(index, $event)"
                @keydown.delete="handleOtpDelete(index, $event)"
                ref="otpInputs"
              >
            </div>

            <!-- Compteur de réenvoi -->
            <div class="text-center text-sm text-gray-500 mt-4">
              <span v-if="resendCooldown > 0">
                Vous pouvez demander un nouveau code dans {{ resendCooldown }}s
              </span>
              <button
                v-else
                type="button"
                @click="resendOtp"
                class="text-indigo-600 hover:text-indigo-500 font-medium"
              >
                Renvoyer le code
              </button>
            </div>
          </div>

          <button 
            type="submit" 
            :disabled="loading || otpDigits.some(d => !d)"
            class="w-full flex justify-center py-3.5 px-4 rounded-lg shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 transition-all duration-200 disabled:opacity-70"
          >
            <span v-if="!loading">Vérifier le code</span>
            <svg v-else class="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">...</svg>
          </button>
        </form>

        <div class="text-center text-sm">
          <router-link 
            to="/login" 
            class="font-medium text-indigo-600 hover:text-indigo-500 hover:underline"
          >
            ← Retour à la connexion
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const step = ref(1)
const email = ref('')
const otpDigits = ref(['', '', '', '', '', ''])
const otpInputs = ref([])
const loading = ref(false)
const errors = ref({})
const resendCooldown = ref(0)
let cooldownInterval = null

const maskedEmail = computed(() => {
  if (!email.value) return ''
  const [name, domain] = email.value.split('@')
  return `${name[0]}${'*'.repeat(name.length - 2)}${name.slice(-1)}@${domain}`
})

// Gestion de la saisie de l'OTP
const handleOtpInput = (index, event) => {
  const value = event.target.value
  if (/^[0-9]$/.test(value)) {
    otpDigits.value[index] = value
    if (index < 5) {
      otpInputs.value[index + 1].focus()
    }
  } else {
    otpDigits.value[index] = ''
  }
}

const handleOtpDelete = (index, event) => {
  if (event.key === 'Backspace' && !otpDigits.value[index] && index > 0) {
    otpInputs.value[index - 1].focus()
  }
}

// Envoi de l'OTP
const sendOtp = async () => {
  errors.value = {}
  if (!email.value) {
    errors.value.email = "L'email est requis"
    return
  }

  loading.value = true
  try {
    // Simulation d'appel API
    await new Promise(resolve => setTimeout(resolve, 1000))
    step.value = 2
    startCooldown()
    // En prod: focus sur le premier champ OTP
    setTimeout(() => otpInputs.value[0]?.focus(), 100)
  } catch (error) {
    errors.value.email = error.message || "Erreur lors de l'envoi du code"
  } finally {
    loading.value = false
  }
}

// Vérification de l'OTP
const verifyOtp = async () => {
  const otpCode = otpDigits.value.join('')
  if (otpCode.length !== 6) return

  loading.value = true
  try {
    // Simulation de vérification
    await new Promise(resolve => setTimeout(resolve, 1000))
    router.push({ 
      name: 'reset-password',
      query: { email: email.value, token: otpCode }
    })
  } catch (error) {
    errors.value.otp = "Code invalide. Veuillez réessayer."
    otpDigits.value = ['', '', '', '', '', '']
    otpInputs.value[0].focus()
  } finally {
    loading.value = false
  }
}

// Gestion du réenvoi
const startCooldown = () => {
  resendCooldown.value = 30
  cooldownInterval = setInterval(() => {
    resendCooldown.value -= 1
    if (resendCooldown.value <= 0) {
      clearInterval(cooldownInterval)
    }
  }, 1000)
}

const resendOtp = async () => {
  await sendOtp()
  startCooldown()
}

onUnmounted(() => {
  if (cooldownInterval) clearInterval(cooldownInterval)
})
</script>