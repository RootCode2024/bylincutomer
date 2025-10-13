<template>
  <div class="max-w-6xl mx-auto p-5 mt-12 mb-12">
    <!-- Progress Bar -->
    <div class="mb-10">
      <div class="flex justify-between relative">
        <div class="absolute top-4 left-0 right-0 h-0.5 bg-gray-200 z-10"></div>
        
        <div 
          v-for="(step, index) in steps" 
          :key="step.id" 
          class="flex flex-col items-center relative z-20 cursor-pointer"
          @click="navigateToStep(index)"
        >
          <div 
            class="w-8 h-8 rounded-full flex items-center justify-center font-semibold mb-2 transition-all duration-300 border-2"
            :class="{
              'bg-blue-500 text-white border-blue-500': currentStep === index,
              'bg-green-500 text-white border-green-500': currentStep > index,
              'bg-white text-gray-600 border-gray-300': currentStep < index
            }"
          >
            <svg v-if="currentStep > index" class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
            </svg>
            <span v-else>{{ index + 1 }}</span>
          </div>
          <div 
            class="text-sm font-medium transition-colors duration-300 text-center"
            :class="{
              'text-blue-600 font-semibold': currentStep === index,
              'text-green-600': currentStep > index,
              'text-gray-500': currentStep < index
            }"
          >
            {{ step.label }}
          </div>
        </div>
      </div>
    </div>

    <!-- Loading Overlay -->
    <div v-if="loading" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white p-6 rounded-lg flex items-center shadow-lg">
        <svg class="animate-spin h-5 w-5 text-blue-600 mr-3" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <span>Traitement en cours...</span>
      </div>
    </div>

    <!-- Error Notification -->
    <div v-if="errorMessage" class="fixed top-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg shadow-lg z-50 max-w-md">
      <div class="flex justify-between items-start">
        <span class="text-sm">{{ errorMessage }}</span>
        <button @click="errorMessage = ''" class="ml-4 text-red-800 hover:text-red-900 text-lg leading-none">
          &times;
        </button>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Left Column - Form Sections -->
      <div class="lg:col-span-2">
        <div class="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
          
          <!-- Shipping Address -->
          <section v-show="currentStep === 0" class="space-y-6">
            <div class="flex items-center gap-3 mb-6">
              <div class="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                </svg>
              </div>
              <h2 class="text-2xl font-semibold text-gray-900">Adresse de livraison</h2>
            </div>
            
            <!-- Address Selection -->
            <div v-if="normalizedUserAddresses && normalizedUserAddresses.length > 0" class="mb-6">
              <label class="block text-sm font-medium text-gray-700 mb-3">
                Choisir une adresse existante
              </label>
              <select
                v-model="selectedAddress"
                @change="onAddressSelect"
                class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-sm bg-white"
              >
                <option value="">-- Sélectionnez une adresse --</option>
                <option
                  v-for="(address, index) in normalizedUserAddresses"
                  :key="index"
                  :value="address.id"
                >
                  {{ formatAddressDisplay(address) }}
                </option>
                <option value="new">+ Nouvelle Adresse</option>
              </select>
            </div>
            
            <!-- New Address Form -->
            <div v-if="selectedAddress === 'new' || !normalizedUserAddresses || normalizedUserAddresses.length === 0" 
                class="space-y-6 p-6 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
              
              <div class="text-sm text-gray-600 mb-4">
                <svg class="w-4 h-4 inline mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/>
                </svg>
                Remplissez les informations ci-dessous pour créer une nouvelle adresse
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Type *</label>
                  <select 
                    v-model="shipping.type"
                    class="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition bg-white"
                    required
                  >
                    <option value="">Sélectionnez un type</option>
                    <option value="home">🏠 Domicile</option>
                    <option value="office">🏢 Bureau</option>
                  </select>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Pays *</label>
                  <select 
                    v-model="shipping.country_code" 
                    class="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition bg-white"
                    required
                  >
                    <option value="">Sélectionnez un pays</option>
                    <option v-for="country in countries" :key="country.id" :value="country.code">
                      {{ country.name }}
                    </option>
                  </select>
                </div>

                <div class="md:col-span-2">
                  <label class="block text-sm font-medium text-gray-700 mb-2">Rue et quartier *</label>
                  <input 
                    v-model="shipping.street_line" 
                    type="text"
                    placeholder="Ex: 205 Rue des Cocotiers, Godomey"
                    class="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                    required
                  >
                </div>

                <div class="md:col-span-2">
                  <label class="block text-sm font-medium text-gray-700 mb-2">Point de repère</label>
                  <input 
                    v-model="shipping.landmark" 
                    type="text"
                    placeholder="Ex: Derrière le marché Dantokpa"
                    class="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  >
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Ville *</label>
                  <input 
                    type="text" 
                    v-model="shipping.city" 
                    placeholder="Ex: Cotonou"
                    class="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                    required
                  >
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Téléphone *</label>
                  <input 
                    type="tel" 
                    v-model="shipping.phone" 
                    placeholder="Ex: 97 85 41 25"
                    class="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                    required
                  >
                </div>

                <!-- Champs conditionnels pour l'international -->
                <template v-if="shipping.country_code !== 'BJ'">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">État/Province</label>
                    <input 
                      type="text" 
                      v-model="shipping.state_province" 
                      placeholder="Ex: Californie"
                      class="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                    >
                  </div>
                  
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Code postal</label>
                    <input 
                      type="text" 
                      v-model="shipping.postal_code" 
                      placeholder="Ex: 75001"
                      class="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                    >
                  </div>
                </template>

                <!-- Option pour définir comme adresse par défaut -->
                <div class="md:col-span-2">
                  <label class="flex items-center">
                    <input 
                      type="checkbox" 
                      v-model="shipping.is_default"
                      class="rounded border-gray-300 text-blue-600 focus:ring-blue-500 mr-2"
                    >
                    <span class="text-sm text-gray-700">Définir comme adresse par défaut</span>
                  </label>
                </div>
              </div>
            </div>
          </section>

          <!-- Shipping Method -->
          <section v-show="currentStep === 1" class="space-y-6">
            <div class="flex items-center gap-3 mb-6">
              <div class="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
                </svg>
              </div>
              <h2 class="text-2xl font-semibold text-gray-900">Méthode de livraison</h2>
            </div>
            
            <div class="space-y-4">
              <!-- BENIN Local Options -->
              <template v-if="shipping.country_code === 'BJ'">
                <!-- Standard - Paiement à la livraison -->
                <div 
                  class="relative p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 hover:border-blue-300"
                  :class="{ 
                    'border-blue-500 bg-blue-50': shipping.method === 'local_standard',
                    'border-gray-200 hover:shadow-sm': shipping.method !== 'local_standard'
                  }"
                  @click="shipping.method = 'local_standard'"
                >
                  <div class="flex items-center">
                    <input 
                      type="radio" 
                      :checked="shipping.method === 'local_standard'"
                      class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                      readonly
                    >
                    <div class="flex-1 ml-4">
                      <div class="flex items-center gap-2 font-medium text-gray-900">
                        <svg class="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                        </svg>
                        {{ getShippingMethod('local_standard')?.name }}
                      </div>
                      <div class="text-sm text-gray-600 mt-1">{{ getShippingMethod('local_standard')?.details }}</div>
                    </div>
                    <div class="text-lg font-semibold text-green-600">A LA LIVRAISON</div>
                  </div>
                  <div class="mt-3 p-3 bg-green-50 text-green-800 text-sm rounded-lg">
                    💵 Paiement en espèces à la livraison uniquement
                  </div>
                </div>

                <!-- Express -->
                <div 
                  class="relative p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 hover:border-blue-300"
                  :class="{ 
                    'border-blue-500 bg-blue-50': shipping.method === 'local_express',
                    'border-gray-200 hover:shadow-sm': shipping.method !== 'local_express'
                  }"
                  @click="shipping.method = 'local_express'"
                >
                  <div class="flex items-center">
                    <input 
                      type="radio" 
                      :checked="shipping.method === 'local_express'"
                      class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                      readonly
                    >
                    <div class="flex-1 ml-4">
                      <div class="flex items-center gap-2 font-medium text-gray-900">
                        <svg class="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd"/>
                        </svg>
                        {{ getShippingMethod('local_express')?.name }}
                      </div>
                      <div class="text-sm text-gray-600 mt-1">{{ getShippingMethod('local_express')?.details }}</div>
                    </div>
                    <div class="text-lg font-semibold text-blue-600">{{ formatCurrency(getShippingMethod('local_express')?.price) }}</div>
                  </div>
                </div>
              </template>

              <!-- INTERNATIONAL Options -->
              <template v-else>
                <!-- DHL Express -->
                <div 
                  class="relative p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 hover:border-blue-300"
                  :class="{ 
                    'border-blue-500 bg-blue-50': shipping.method === 'dhl_express',
                    'border-gray-200 hover:shadow-sm': shipping.method !== 'dhl_express'
                  }"
                  @click="shipping.method = 'dhl_express'"
                >
                  <div class="flex items-center">
                    <input 
                      type="radio" 
                      :checked="shipping.method === 'dhl_express'"
                      class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                      readonly
                    >
                    <div class="flex-1 ml-4">
                      <div class="flex items-center gap-2 font-medium text-gray-900">
                        <svg class="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fill-rule="evenodd" d="M12 1.586l-4 4v12.828l4-4V1.586zM3.707 3.293A1 1 0 002 4v10a1 1 0 00.293.707L6 18.414V5.586L3.707 3.293zM17.707 5.293L14 1.586v12.828l2.293 2.293A1 1 0 0018 16V6a1 1 0 00-.293-.707z" clip-rule="evenodd"/>
                        </svg>
                        {{ getShippingMethod('dhl_express')?.name }}
                      </div>
                      <div class="text-sm text-gray-600 mt-1">{{ getShippingMethod('dhl_express')?.details }}</div>
                    </div>
                    <div class="text-lg font-semibold text-red-600">{{ formatCurrency(getShippingMethod('dhl_express')?.price) }}</div>
                  </div>
                </div>
              </template>
            </div>
          </section>

          <!-- Payment Section -->
          <section v-show="currentStep === 2" class="space-y-6">
            <div class="flex items-center gap-3 mb-6">
              <div class="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-md">
                <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"/>
                </svg>
              </div>
              <h2 class="text-2xl font-bold text-gray-900">Méthode de paiement</h2>
            </div>
  
            <!-- Payment Method Tabs -->
            <div v-if="availablePaymentTabs.length > 0" class="flex gap-2 p-1.5 bg-gray-100 rounded-xl">
              <button 
                v-for="tab in availablePaymentTabs" 
                :key="tab.id" 
                class="flex-1 px-6 py-3.5 font-semibold text-sm transition-all duration-300 rounded-lg relative"
                :class="{ 
                  'bg-white text-blue-600 shadow-md transform scale-105': paymentMethod === tab.id,
                  'text-gray-600 hover:text-gray-800 hover:bg-gray-50': paymentMethod !== tab.id
                }"
                @click="paymentMethod = tab.id"
              >
                <div class="flex justify-center items-center space-x-4">
                  <svg v-if="tab.id === 'mobile_money'" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1" stroke="currentColor" class="w-8 h-8 text-gray-700">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 0 0 6 3.75v16.5a2.25 2.25 0 0 0 2.25 2.25h7.5A2.25 2.25 0 0 0 18 20.25V3.75a2.25 2.25 0 0 0-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />
                  </svg>
                  <svg v-if="tab.id === 'credit_card'" data-slot="icon" fill="none" stroke-width="1" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" class="w-8 h-8 text-gray-700">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Z"></path>
                  </svg>
                  <svg v-if="tab.id === 'paypal'" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-8 h-8"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <circle cx="24" cy="24" r="20" fill="#0070BA"></circle> <path d="M32.3305 18.0977C32.3082 18.24 32.2828 18.3856 32.2542 18.5351C31.2704 23.5861 27.9046 25.331 23.606 25.331H21.4173C20.8916 25.331 20.4486 25.7127 20.3667 26.2313L19.2461 33.3381L18.9288 35.3527C18.8755 35.693 19.1379 36 19.4815 36H23.3634C23.8231 36 24.2136 35.666 24.286 35.2127L24.3241 35.0154L25.055 30.3772L25.1019 30.1227C25.1735 29.6678 25.5648 29.3338 26.0245 29.3338H26.6051C30.3661 29.3338 33.3103 27.8068 34.1708 23.388C34.5303 21.5421 34.3442 20.0008 33.393 18.9168C33.1051 18.59 32.748 18.3188 32.3305 18.0977Z" fill="white" fill-opacity="0.6"></path> <path d="M31.3009 17.6871C31.1506 17.6434 30.9955 17.6036 30.8364 17.5678C30.6766 17.5328 30.5127 17.5018 30.3441 17.4748C29.754 17.3793 29.1074 17.334 28.4147 17.334H22.5676C22.4237 17.334 22.2869 17.3666 22.1644 17.4254C21.8948 17.5551 21.6944 17.8104 21.6459 18.1229L20.402 26.0013L20.3662 26.2311C20.4481 25.7126 20.8911 25.3308 21.4168 25.3308H23.6055C27.9041 25.3308 31.2699 23.5851 32.2537 18.5349C32.2831 18.3854 32.3078 18.2398 32.33 18.0975C32.0811 17.9655 31.8115 17.8525 31.5212 17.7563C31.4496 17.7324 31.3757 17.7094 31.3009 17.6871Z" fill="white" fill-opacity="0.8"></path> <path d="M21.6461 18.1231C21.6946 17.8105 21.895 17.5552 22.1646 17.4264C22.2879 17.3675 22.4239 17.3349 22.5678 17.3349H28.4149C29.1077 17.3349 29.7542 17.3803 30.3444 17.4757C30.513 17.5027 30.6768 17.5338 30.8367 17.5687C30.9957 17.6045 31.1508 17.6443 31.3011 17.688C31.3759 17.7103 31.4498 17.7334 31.5222 17.7564C31.8125 17.8527 32.0821 17.9664 32.331 18.0976C32.6237 16.231 32.3287 14.9601 31.3194 13.8093C30.2068 12.5424 28.1986 12 25.629 12H18.169C17.6441 12 17.1963 12.3817 17.1152 12.9011L14.0079 32.5969C13.9467 32.9866 14.2473 33.3381 14.6402 33.3381H19.2458L20.4022 26.0014L21.6461 18.1231Z" fill="white"></path> </g></svg>
                  <span>{{ tab.label }}</span>
                </div>
              </button>
            </div>

            <!-- Mobile Money Options -->
            <div v-if="paymentMethod === 'mobile_money'" class="space-y-6 p-6 bg-gradient-to-br from-white to-gray-50 border-2 border-gray-200 rounded-2xl shadow-sm">
              <div class="text-center mb-6">
                <h3 class="text-lg font-bold text-gray-900 mb-2">Choisissez votre opérateur mobile</h3>
                <p class="text-sm text-gray-600">Paiement sécurisé via Mobile Money</p>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <!-- MTN Mobile Money -->
                <div 
                  v-if="shipping.country_code === 'BJ'"
                  class="group p-5 border-3 rounded-2xl text-center cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
                  :class="{ 
                    'border-yellow-500 bg-gradient-to-br from-yellow-50 to-yellow-100 shadow-lg scale-105': selectedMobileMoney === 'mtn', 
                    'border-gray-200 bg-white hover:border-yellow-300': selectedMobileMoney !== 'mtn' 
                  }"
                  @click="selectMobileMoney('mtn')"
                >
                  <div class="mb-4 flex justify-center">
                    <div style="background-color: #ffcb05;" class="w-20 h-20 rounded-2xl shadow-md flex items-center justify-center p-3 transition-transform group-hover:scale-110">
                      <img 
                        src="https://www.mtn.com/wp-content/themes/mtn-refresh/public/img/mtn-logo.svg" 
                        alt="MTN Mobile Money" 
                        class="w-full h-full object-contain"
                      >
                    </div>
                  </div>
                  <div class="text-base font-bold text-gray-900">MTN Mobile Money</div>
                  <div class="text-xs text-gray-600 mt-1">Paiement instantané</div>
                  <div v-if="selectedMobileMoney === 'mtn'" class="mt-3 flex items-center justify-center">
                    <svg class="w-5 h-5 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                    </svg>
                  </div>
                </div>

                <!-- Moov Money -->
                <div 
                  v-if="shipping.country_code === 'BJ' || shipping.country_code === 'TG' || shipping.country_code === 'CI'"
                  class="group p-5 border-3 rounded-2xl text-center cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
                  :class="{ 
                    'border-blue-500 bg-gradient-to-br from-blue-50 to-blue-100 shadow-lg scale-105': selectedMobileMoney === 'moov', 
                    'border-gray-200 bg-white hover:border-blue-300': selectedMobileMoney !== 'moov' 
                  }"
                  @click="selectMobileMoney('moov')"
                >
                  <div class="mb-4 flex justify-center">
                    <div style="background-color: #0055bb;" class="w-20 h-20 rounded-2xl shadow-md flex items-center justify-center p-3 transition-transform group-hover:scale-110">
                      <img 
                        src="https://www.moov-africa.bj/wp-content/uploads/2022/10/LOGO-MOOV-AFRICA-.png" 
                        alt="Moov Money" 
                        class="w-full h-full object-contain"
                      >
                    </div>
                  </div>
                  <div class="text-base font-bold text-gray-900">Moov Money</div>
                  <div class="text-xs text-gray-600 mt-1">Paiement instantané</div>
                  <div v-if="selectedMobileMoney === 'moov'" class="mt-3 flex items-center justify-center">
                    <svg class="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                    </svg>
                  </div>
                </div>

                <!-- Celtiis Money -->
                <div 
                  v-if="shipping.country_code === 'BJ'"
                  class="group p-5 border-3 rounded-2xl text-center cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
                  :class="{ 
                    'border-blue-500 bg-gradient-to-br from-blue-50 to-blue-100 shadow-lg scale-105': selectedMobileMoney === 'celtiis', 
                    'border-gray-200 bg-white hover:border-blue-300': selectedMobileMoney !== 'celtiis' 
                  }"
                  @click="selectMobileMoney('celtiis')"
                >
                  <div class="mb-4 flex justify-center">
                    <div style="background-color: #1c3b72;" class="w-20 h-20 rounded-2xl shadow-md flex items-center justify-center p-3 transition-transform group-hover:scale-110">
                      <img 
                        src="https://celtiis.bj/_next/image?url=%2Fceltiis-logo-rounded.svg&w=128&q=75" 
                        alt="Celtiis" 
                        class="w-full h-full object-contain"
                      >
                    </div>
                  </div>
                  <div class="text-base font-bold text-gray-900">Celtiis Cash</div>
                  <div class="text-xs text-gray-600 mt-1">Paiement instantané</div>
                  <div v-if="selectedMobileMoney === 'celtiis'" class="mt-3 flex items-center justify-center">
                    <svg class="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                    </svg>
                  </div>
                </div>

                <!-- Orange Money -->
                <div 
                  v-if="shipping.country_code === 'SN' || shipping.country_code === 'CI' || shipping.country_code === 'BF'"
                  class="group p-5 border-3 rounded-2xl text-center cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
                  :class="{ 
                    'border-orange-500 bg-gradient-to-br from-orange-50 to-orange-100 shadow-lg scale-105': selectedMobileMoney === 'orange', 
                    'border-gray-200 bg-white hover:border-orange-300': selectedMobileMoney !== 'orange' 
                  }"
                  @click="selectMobileMoney('orange')"
                >
                  <div class="mb-4 flex justify-center">
                    <div class="w-20 h-20 bg-white rounded-2xl shadow-md flex items-center justify-center p-3 transition-transform group-hover:scale-110">
                      <img 
                        src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/Orange_logo.svg/2560px-Orange_logo.svg.png" 
                        alt="Orange Money" 
                        class="w-full h-full object-contain"
                      >
                    </div>
                  </div>
                  <div class="text-base font-bold text-gray-900">Orange Money</div>
                  <div class="text-xs text-gray-600 mt-1">Paiement instantané</div>
                  <div v-if="selectedMobileMoney === 'orange'" class="mt-3 flex items-center justify-center">
                    <svg class="w-5 h-5 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                    </svg>
                  </div>
                </div>

                <!-- Wave -->
                <div 
                  v-if="shipping.country_code === 'SN' || shipping.country_code === 'CI'"
                  class="group p-5 border-3 rounded-2xl text-center cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
                  :class="{ 
                    'border-[#1AB3E5] bg-gradient-to-br from-[#1ab2e53a] to-[#1ab2e593] shadow-lg scale-105': selectedMobileMoney === 'wave', 
                    'border-gray-200 bg-white hover:border-[#1ab2e59c]': selectedMobileMoney !== 'wave' 
                  }"
                  @click="selectMobileMoney('wave')"
                >
                  <div class="mb-4 flex justify-center">
                    <div class="w-20 h-20 bg-white rounded-2xl shadow-md flex items-center justify-center p-3 transition-transform group-hover:scale-110">
                      <img 
                        src="https://www.wave.com/img/nav-logo.png" 
                        alt="Wave" 
                        class="w-full h-full object-contain"
                      >
                    </div>
                  </div>
                  <div class="text-base font-bold text-gray-900">Wave</div>
                  <div class="text-xs text-gray-600 mt-1">Paiement instantané</div>
                  <div v-if="selectedMobileMoney === 'wave'" class="mt-3 flex items-center justify-center">
                    <svg class="w-5 h-5 text-[#1AB3E5]" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                    </svg>
                  </div>
                </div>

                <!-- Free Sénégal -->
                <div 
                  v-if="shipping.country_code === 'SN'"
                  class="group p-5 border-3 rounded-2xl text-center cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
                  :class="{ 
                    'border-[#FFD100] bg-gradient-to-br from-[#ffd00056] to-[#ffd0006f] shadow-lg scale-105': selectedMobileMoney === 'freesn', 
                    'border-[#FFD100]-white hover:border-[#FFD100]': selectedMobileMoney !== 'freesn' 
                  }"
                  @click="selectMobileMoney('freesn')"
                >
                  <div class="mb-4 flex justify-center">
                    <div class="w-20 h-20 bg-[#FFD100] rounded-2xl shadow-md flex items-center justify-center p-3 transition-transform group-hover:scale-110">
                      <img 
                        src="https://cdn-ilcckdd.nitrocdn.com/zWDfZJLqRQmQVXoaKATzBZGWqfDqvOXo/assets/images/optimized/rev-45fe558/www.yas.sn/wp-content/uploads/2024/02/jem_logo.svg" 
                        alt="Free Senegal" 
                        class="w-full h-full object-contain"
                      >
                    </div>
                  </div>
                  <div class="text-base font-bold text-gray-900">Free Money</div>
                  <div class="text-xs text-gray-600 mt-1">Paiement instantané</div>
                  <div v-if="selectedMobileMoney === 'freesn'" class="mt-3 flex items-center justify-center">
                    <svg class="w-5 h-5 text-[#FFD100]" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                    </svg>
                  </div>
                </div>
              </div>

              <!-- Phone Number Input -->
              <transition name="fade-slide">
                <div v-if="selectedMobileMoney" class="space-y-4 p-6 bg-white rounded-xl border-2 border-gray-200 shadow-sm">
                  <div class="flex items-center gap-3 mb-4">
                    <div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <svg class="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"/>
                      </svg>
                    </div>
                    <div>
                      <h4 class="font-bold text-gray-900">Numéro de téléphone</h4>
                      <p class="text-sm text-gray-600">Entrez votre numéro {{ selectedMobileMoney.toUpperCase() }}</p>
                    </div>
                  </div>

                  <div class="flex gap-3">
                    <!-- Country Code Select - Version améliorée -->
                    <div class="relative flex-1 max-w-44">
                      <select 
                        v-model="mobilePayment.countryCode"
                        class="w-full h-full pl-4 pr-10 py-4 text-base border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all font-medium appearance-none bg-white cursor-pointer hover:border-gray-400"
                      >
                        <option value="+229" v-if="shipping.country_code === 'BJ'">Bénin +229</option>
                        <option value="+225" v-if="shipping.country_code === 'CI'">Côte d'Ivoire +225</option>
                        <option value="+226" v-if="shipping.country_code === 'BF'">Burkina Faso +226</option>
                        <option value="+228" v-if="shipping.country_code === 'TG'">Togo +228</option>
                        <option value="+221" v-if="shipping.country_code === 'SN'">Sénégal +221</option>
                      </select>
                      <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
                        </svg>
                      </div>
                    </div>

                    <!-- Phone Number Input -->
                    <div class="flex-1">
                      <input 
                        type="tel" 
                        v-model="mobilePayment.phone" 
                        :placeholder="getPhonePlaceholder()"
                        maxlength="15"
                        class="block w-full px-4 py-4 text-lg border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all font-medium placeholder-gray-400"
                        @input="formatPhoneNumber"
                        required
                      >
                    </div>
                  </div>

                  <!-- Phone number format helper -->
                  <div class="text-xs text-gray-500 px-1">
                    Format: {{ getPhoneFormatExample() }}
                  </div>

                  <div class="flex items-start gap-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <svg class="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z" clip-rule="evenodd"/>
                    </svg>
                    <p class="text-xs text-blue-800 font-medium">
                      Vous recevrez une notification sur votre téléphone pour valider le paiement
                    </p>
                  </div>
                </div>
              </transition>
            </div>

            <!-- Credit Card Form -->
            <div v-else-if="paymentMethod === 'credit_card'" class="space-y-6 p-6 bg-gradient-to-br from-white to-gray-50 border-2 border-gray-200 rounded-2xl shadow-sm">
              <div class="text-center mb-6">
                <div class="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-lg mb-4">
                  <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"/>
                  </svg>
                  <h3 class="text-lg font-bold text-white">Carte bancaire</h3>
                </div>
                <p class="text-sm text-gray-600">Paiement sécurisé SSL</p>
              </div>

              <div class="grid grid-cols-1 gap-5">
                <div>
                  <label class="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                    <svg class="w-4 h-4 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z"/>
                      <path fill-rule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clip-rule="evenodd"/>
                    </svg>
                    Numéro de carte
                  </label>
                  <input 
                    type="text" 
                    v-model="payment.cardNumber" 
                    placeholder="1234 5678 9012 3456"
                    maxlength="19"
                    class="w-full px-4 py-4 text-lg border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all font-mono"
                    @input="formatCardNumber"
                    required
                  >
                </div>
                
                <div>
                  <label class="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                    <svg class="w-4 h-4 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd"/>
                    </svg>
                    Nom sur la carte
                  </label>
                  <input 
                    type="text" 
                    v-model="payment.cardName" 
                    placeholder="JEAN DUPONT"
                    class="w-full px-4 py-4 text-lg border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all uppercase"
                    required
                  >
                </div>
                
                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                      <svg class="w-4 h-4 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clip-rule="evenodd"/>
                      </svg>
                      Expiration
                    </label>
                    <input 
                      type="text" 
                      v-model="payment.expiryDate" 
                      placeholder="MM/AA"
                      maxlength="5"
                      class="w-full px-4 py-4 text-lg border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-center font-mono"
                      @input="formatExpiryDate"
                      required
                    >
                  </div>
                  
                  <div>
                    <label class="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                      <svg class="w-4 h-4 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd"/>
                      </svg>
                      CVV
                    </label>
                    <input 
                      type="text" 
                      v-model="payment.cvv" 
                      placeholder="123"
                      maxlength="4"
                      class="w-full px-4 py-4 text-lg border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-center font-mono"
                      required
                    >
                  </div>
                </div>
              </div>

              <div class="flex items-center justify-center gap-4 pt-4 border-t-2 border-gray-200">
                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b7/MasterCard_Logo.svg/2560px-MasterCard_Logo.svg.png" alt="Mastercard" class="h-8 opacity-70">
                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/2560px-Visa_Inc._logo.svg.png" alt="Visa" class="h-8 opacity-70">
                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/American_Express_logo_%282018%29.svg/1200px-American_Express_logo_%282018%29.svg.png" alt="American Express" class="h-7 opacity-70">
              </div>
            </div>

            <!-- PayPal -->
            <div v-else-if="paymentMethod === 'paypal'" class="p-10 bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-2xl shadow-sm">
              <div class="text-center">
                <div class="mb-6 flex justify-center">
                  <div class="w-32 h-20 bg-white rounded-2xl shadow-lg flex items-center justify-center p-4">
                    <img 
                      src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/PayPal.svg/2560px-PayPal.svg.png" 
                      alt="PayPal" 
                      class="w-full h-full object-contain"
                    >
                  </div>
                </div>
                <h3 class="text-xl font-bold text-gray-900 mb-3">Paiement sécurisé avec PayPal</h3>
                <p class="text-gray-600 mb-6 max-w-md mx-auto">Vous serez redirigé vers PayPal pour finaliser votre paiement en toute sécurité</p>
                
                <div class="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl font-bold shadow-md">
                  <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd"/>
                  </svg>
                  <span>Paiement 100% sécurisé</span>
                </div>
              </div>
            </div>
          </section>

          <!-- Confirmation -->
          <section v-show="currentStep === 3" class="text-center py-12">
            <div class="max-w-md mx-auto">
              <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
              
              <h2 class="text-3xl font-bold text-gray-900 mb-2">Commande confirmée !</h2>
              <p class="text-xl text-blue-600 mb-4 font-semibold">N° {{ orderNumber }}</p>
              <p class="text-gray-600 mb-8">Nous avons envoyé les détails à <strong>{{ shipping.email }}</strong></p>
              
              <div class="bg-gray-50 rounded-xl p-6 text-left space-y-4 mb-8 border">
                <div class="flex justify-between items-center">
                  <span class="text-gray-600 font-medium">Date estimée de livraison</span>
                  <span class="font-semibold text-gray-900">{{ estimatedDelivery }}</span>
                </div>
                <div class="flex justify-between items-center">
                  <span class="text-gray-600 font-medium">Méthode de livraison</span>
                  <span class="font-semibold text-gray-900">{{ selectedShippingMethod.name }}</span>
                </div>
                <div class="flex justify-between items-start">
                  <span class="text-gray-600 font-medium">Adresse de livraison</span>
                  <span class="font-semibold text-gray-900 text-right">
                    {{ formatAddressDisplay(shipping) }}<br>
                    {{ shipping.phone }}
                  </span>
                </div>
              </div>

              <div class="flex flex-col sm:flex-row gap-4 justify-center">
                <button @click="trackOrder" class="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
                  </svg>
                  Suivre ma commande
                </button>
                <button @click="continueShopping" class="flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
                  </svg>
                  Continuer mes achats
                </button>
              </div>
            </div>
          </section>

          <!-- Navigation Buttons -->
          <div class="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
            <button 
              v-if="currentStep > 0 && currentStep < 3"
              @click="previousStep"
              class="flex items-center gap-2 px-6 py-3 text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded-lg transition-colors font-medium"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
              </svg>
              Retour
            </button>
            <div v-else></div>

            <button 
              v-if="currentStep < 3"
              @click="nextStep"
              class="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-sm"
              :disabled="!canProceed || loading"
              :class="{ 'opacity-50 cursor-not-allowed': !canProceed || loading }"
            >
              <span>{{ getNextButtonText() }}</span>
              <svg v-if="!loading" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
              </svg>
              <svg v-else class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Right Column - Order Summary -->
      <div class="lg:col-span-1">
        <div class="bg-white rounded-xl p-6 shadow-sm border border-gray-100 sticky top-4">
          <div class="flex items-center gap-2 mb-6">
            <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
            </svg>
            <h3 class="text-lg font-semibold text-gray-900">Récapitulatif</h3>
          </div>
          
          <!-- Items List -->
          <div class="space-y-4 mb-6">
            <div v-for="item in cartItems" :key="item.id" 
                 class="flex justify-between items-start text-sm bg-gray-50 p-3 rounded-lg">
              <div class="flex-1">
                <div class="font-medium text-gray-900 mb-1">{{ item.name }}</div>
                <div class="text-gray-600">Qté: {{ item.quantity }}</div>
              </div>
              <div class="font-medium text-gray-900">{{ formatCurrency(item.price * item.quantity) }}</div>
            </div>
          </div>
          
          <!-- Summary Totals -->
          <div class="border-t border-gray-200 pt-4 space-y-3">
            <div class="flex justify-between text-sm text-gray-600">
              <span>Sous-total ({{ cartItems.length }} article{{ cartItems.length > 1 ? 's' : '' }})</span>
              <span>{{ formatCurrency(subtotal) }}</span>
            </div>
            
            <div v-if="cartStore.couponValue" class="flex justify-between text-sm text-red-600">
              <span>Reduction</span>
              <span>-{{ formatCurrency(cartStore.couponValue) }}</span>
            </div>
            
            <div v-if="shippingCost > 0" class="flex justify-between text-sm text-gray-600">
              <span>Livraison</span>
              <span>{{ formatCurrency(shippingCost) }}</span>
            </div>
            
            <div v-else-if="shipping.method === 'local_standard'" class="flex justify-between text-sm text-green-600">
              <span>Livraison</span>
              <span class="font-medium">A LA LIVRAISON</span>
            </div>
            
            <div class="flex justify-between font-bold text-lg border-t border-gray-200 pt-3 text-gray-900">
              <span>Total</span>
              <span>{{ formatCurrency(orderTotal) }}</span>
            </div>
          </div>

          <!-- Security Notice -->
          <div class="mt-6 p-3 bg-green-50 rounded-lg border border-green-200">
            <div class="flex items-center gap-2 text-green-800 text-sm">
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd"/>
              </svg>
              <span class="font-medium">Paiement 100% sécurisé</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, reactive, onMounted, watch } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useCartStore } from '@/stores/cart';
import { useUserStore } from '@/stores/user';
import { useOrdersStore } from '@/stores/order';
import { useCurrencyStore } from '@/stores/currency';
import { useUIStore } from '@/stores/ui';
import { useRouter } from 'vue-router';

const router = useRouter();
const cartStore = useCartStore();
const authStore = useAuthStore();
const orderStore = useOrdersStore();
const userStore = useUserStore();
const uiStore = useUIStore();
const currencyStore = useCurrencyStore();

// Steps configuration
const steps = ref([
  { id: 'shipping', label: 'Livraison' },
  { id: 'method', label: 'Expédition' },
  { id: 'payment', label: 'Paiement' },
  { id: 'confirmation', label: 'Confirmation' }
]);

const currentStep = ref(0);
const selectedAddress = ref('new');
const loading = ref(false);
const errorMessage = ref('');

// Shipping form - Adapté à la structure de la table
const shipping = reactive({
  type: 'home',
  street_line: '',
  landmark: '',
  city: 'Cotonou',
  state_province: '',
  postal_code: '',
  country_code: 'BJ',
  phone: '',
  email: authStore.user?.email || 'user@example.com',
  method: '',
  is_default: false
});

// Payment form
const payment = reactive({
  cardNumber: '',
  cardName: '',
  expiryDate: '',
  cvv: ''
});

const paymentMethod = ref('mobile_money');
const selectedMobileMoney = ref('');

const paymentTabs = ref([
  { id: 'mobile_money', label: 'Mobile Money' },
  { id: 'credit_card', label: 'Carte de crédit' },
  { id: 'paypal', label: 'PayPal' }
]);

const mobileMoneyMethods = ref([
  { id: 'mtn', name: 'MTN Mobile Money' },
  { id: 'moov', name: 'Moov Money' },
  { id: 'orange', name: 'Orange Money' }
]);

const mobilePayment = reactive({
  phone: '',
  provider: '',
  countryCode: '+229' // Valeur par défaut pour le Bénin
});

const shippingMethods = ref([
  {
    id: 'local_express',
    name: 'Express (Cotonou)',
    details: '4000 FCFA - Livraison en moins de 2h dans Cotonou',
    price: 4000,
    availableCountries: ['BJ'],
    paymentType: 'online'
  },
  {
    id: 'local_standard',
    name: 'Standard (Bénin)',
    details: 'Livraison standard - Paiement à la réception sous 24h',
    price: 0,
    availableCountries: ['BJ'],
    paymentType: 'cash_on_delivery'
  },
  {
    id: 'dhl_express',
    name: 'Livraison Internationale DHL',
    details: '25000 FCFA - Livraison internationale par DHL Express',
    price: 25000,
    availableCountries: ['FR', 'CI', 'US', 'CA'],
    paymentType: 'online'
  }
]);

const countries = ref([]);
const cartItems = ref([]);
const orderNumber = ref('');

// Computed properties
const normalizedUserAddresses = computed(() => {
  const addresses = authStore.user?.addresses;

  console.log('User addresses:', addresses);
  if (Array.isArray(addresses)) {
    return addresses;
  } else if (addresses && typeof addresses === 'object') {
    return [addresses];
  }
  return [];
});

const availablePaymentTabs = computed(() => {
  // Si c'est une livraison standard au Bénin, seulement cash on delivery
  if (shipping.method === 'local_standard') {
    return []; // Pas d'options de paiement en ligne
  }
  return paymentTabs.value;
});

const selectedShippingMethod = computed(() => {
  return shippingMethods.value.find(method => method.id === shipping.method) || {};
});

const subtotal = computed(() => {
  return cartItems.value.reduce((sum, item) => sum + (item.price * item.quantity), 0);
});

const shippingCost = computed(() => {
  return selectedShippingMethod.value.price || 0;
});

const orderTotal = computed(() => {
  return ((subtotal.value + shippingCost.value) - cartStore.couponValue);
});

const estimatedDelivery = computed(() => {
  const date = new Date();
  if (shipping.method === 'local_standard') date.setDate(date.getDate() + 1);
  else if (shipping.method === 'local_express') date.setHours(date.getHours() + 2);
  else if (shipping.method === 'dhl_express') date.setDate(date.getDate() + 5);
  else date.setDate(date.getDate() + 3);
  
  return date.toLocaleDateString('fr-FR', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
});

const canProceed = computed(() => {
  console.log('Validating step:', currentStep.value);
  console.log('Selected address:', selectedAddress.value);
  console.log('Shipping info:', shipping);
  
  switch(currentStep.value) {
    case 0:
      if (selectedAddress.value && selectedAddress.value !== 'new') {
        console.log('Address selected, proceeding allowed');
        return true;
      } else {
        const requiredFields = [
          shipping.type?.trim(), 
          shipping.street_line?.trim(), 
          shipping.city?.trim(), 
          shipping.country_code,
          shipping.phone?.trim()
        ];
        
        const isValid = requiredFields.every(field => {
          const valid = !!field;
          console.log('Field validation:', field, '=>', valid);
          return valid;
        });
        
        console.log('New address validation result:', isValid);
        return isValid;
      }
      
    case 1:
      const methodValid = !!shipping.method;
      console.log('Shipping method validation:', shipping.method, '=>', methodValid);
      return methodValid;
      
    case 2:
      // Pas de validation nécessaire si c'est cash on delivery
      if (shipping.method === 'local_standard') {
        console.log('Cash on delivery, no payment validation needed');
        return true;
      }
      
      if (paymentMethod.value === 'mobile_money') {
        const phoneValid = mobilePayment.phone && mobilePayment.phone.trim().length >= 8;
        const result = selectedMobileMoney.value && phoneValid;
        console.log('Mobile money validation:', {
          provider: selectedMobileMoney.value,
          phone: mobilePayment.phone,
          valid: result
        });
        return result;
      } else if (paymentMethod.value === 'credit_card') {
        const cardNumberValid = payment.cardNumber.replace(/\s/g, '').length >= 15;
        const nameValid = payment.cardName.trim().length > 0;
        const expiryValid = /^\d{2}\/\d{2}$/.test(payment.expiryDate);
        const cvvValid = /^\d{3,4}$/.test(payment.cvv);
        
        const result = cardNumberValid && nameValid && expiryValid && cvvValid;
        console.log('Credit card validation:', {
          cardNumber: cardNumberValid,
          name: nameValid,
          expiry: expiryValid,
          cvv: cvvValid,
          valid: result
        });
        return result;
      }
      
      console.log('PayPal or other method, validation passed');
      return true;
      
    default:
      return true;
  }
});

// Methods
function navigateToStep(index) {
  if (index < currentStep.value) {
    currentStep.value = index;
  }
}

function previousStep() {
  if (currentStep.value > 0) {
    currentStep.value--;
  }
}

function selectMobileMoney(method) {
  selectedMobileMoney.value = method;
  mobilePayment.provider = method;
}

function getPhonePlaceholder() {
  const country = mobilePayment.countryCode;
  switch(country) {
    case '+229': // Bénin
      return '97 85 41 25';
    case '+225': // Côte d'Ivoire
      return '07 85 41 25 36';
    case '+221': // Sénégal
      return '77 123 45 67';
    default:
      return 'Numéro de téléphone';
  }
}

function getPhoneFormatExample() {
  const country = mobilePayment.countryCode;
  switch(country) {
    case '+229': // Bénin
      return 'Ex: 97 85 41 25 (8 chiffres)';
    case '+226': // Burkina
      return 'Ex: 97 85 41 25 (8 chiffres)';
    case '+228': // Togo
      return 'Ex: 97 85 41 25 (8 chiffres)';
    case '+225': // Côte d'Ivoire
      return 'Ex: 07 85 41 25 36 (10 chiffres)';
    case '+221': // Sénégal
      return 'Ex: 77 123 45 67 (9 chiffres)';
    default:
      return 'Entrez votre numéro de téléphone';
  }
}

function formatPhoneNumber(event) {
  let value = event.target.value.replace(/\D/g, '');
  const country = mobilePayment.countryCode;
  
  switch(country) {
    case '+229': // Bénin: 97 85 41 25
      if (value.length <= 2) {
        value = value;
      } else if (value.length <= 4) {
        value = value.replace(/(\d{2})/, '$1 ');
      } else if (value.length <= 6) {
        value = value.replace(/(\d{2})(\d{2})/, '$1 $2 ');
      } else {
        value = value.replace(/(\d{2})(\d{2})(\d{2})/, '$1 $2 $3 ');
      }
      break;
      
    case '+225': // Côte d'Ivoire: 07 85 41 25 36
      if (value.length <= 2) {
        value = value;
      } else if (value.length <= 4) {
        value = value.replace(/(\d{2})/, '$1 ');
      } else if (value.length <= 6) {
        value = value.replace(/(\d{2})(\d{2})/, '$1 $2 ');
      } else if (value.length <= 8) {
        value = value.replace(/(\d{2})(\d{2})(\d{2})/, '$1 $2 $3 ');
      } else {
        value = value.replace(/(\d{2})(\d{2})(\d{2})(\d{2})/, '$1 $2 $3 $4 ');
      }
      break;
      
    case '+228': // Togo: 68 00 00 00
      if (value.length <= 2) {
        value = value;
      } else if (value.length <= 4) {
        value = value.replace(/(\d{2})/, '$1 ');
      } else if (value.length <= 6) {
        value = value.replace(/(\d{2})(\d{2})/, '$1 $2 ');
      } else {
        value = value.replace(/(\d{2})(\d{2})(\d{2})/, '$1 $2 $3 ');
      }
      break;
    case '+226': // Burkina Faso: 5 66 00 00 00
      if (value.length <= 2) {
              value = value;
            } else if (value.length <= 4) {
              value = value.replace(/(\d{2})/, '$1 ');
            } else if (value.length <= 6) {
              value = value.replace(/(\d{2})(\d{2})/, '$1 $2 ');
            } else {
              value = value.replace(/(\d{1})(\d{2})(\d{2})(\d{2})/, '$1 $2 $3 $4 ');
            }
      break;
      case '+221': // Sénégal: 77 000 00 00
        if (value.length <= 2) {
          value = value;
        } else if (value.length <= 3) {
          value = value.replace(/(\d{2})(\d{1})/, '$1 $2');
        } else if (value.length <= 4) {
          value = value.replace(/(\d{2})(\d{2})/, '$1 $2');
        } else if (value.length <= 5) {
          value = value.replace(/(\d{2})(\d{3})/, '$1 $2');
        } else if (value.length <= 6) {
          value = value.replace(/(\d{2})(\d{3})(\d{1})/, '$1 $2 $3');
        } else if (value.length <= 7) {
          value = value.replace(/(\d{2})(\d{3})(\d{2})/, '$1 $2 $3');
        } else if (value.length <= 8) {
          value = value.replace(/(\d{2})(\d{3})(\d{2})(\d{1})/, '$1 $2 $3 $4');
        } else {
          value = value.replace(/(\d{2})(\d{3})(\d{2})(\d{2})/, '$1 $2 $3 $4');
        }
        break;
      }
  
  mobilePayment.phone = value.trim();
}

function formatCardNumber(event) {
  let value = event.target.value.replace(/\s/g, '').replace(/\D/g, '');
  value = value.replace(/(\d{4})/g, '$1 ').trim();
  payment.cardNumber = value.substring(0, 19);
}

function formatExpiryDate(event) {
  let value = event.target.value.replace(/\D/g, '');
  if (value.length >= 2) {
    value = value.substring(0, 2) + '/' + value.substring(2, 4);
  }
  payment.expiryDate = value.substring(0, 5);
}

function getShippingMethod(id) {
  return shippingMethods.value.find(method => method.id === id);
}

function getCountryName(countryCode) {
  const country = countries.value.find(c => c.code === countryCode);
  return country?.name || 'Pays inconnu';
}

function formatCurrency(amount) {
  if (currencyStore?.formatCurrency) {
    return currencyStore.formatCurrency(amount);
  }
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'XOF',
    minimumFractionDigits: 0
  }).format(amount);
}

function formatAddressDisplay(address) {
  let display = address.street_line;
  if (address.landmark) {
    display += ` (${address.landmark})`;
  }
  display += `, ${address.city}`;
  if (address.country_code !== 'BJ') {
    display += `, ${getCountryName(address.country_code)}`;
  }
  return display;
}

function getNextButtonText() {
  if (currentStep.value === 2) {
    return shipping.method === 'local_standard' ? 'Confirmer la commande' : 'Finaliser la commande';
  }
  return 'Continuer';
}

async function nextStep() {
  if (!canProceed.value) {
    errorMessage.value = "Veuillez compléter toutes les informations requises avant de continuer.";
    setTimeout(() => errorMessage.value = '', 5000);
    return;
  }

  // Si c'est la dernière étape (paiement), soumettre la commande
  if (currentStep.value === 2) {
    await submitOrder();
  } else {
    currentStep.value++;
  }
}

function onAddressSelect() {
  if (selectedAddress.value && selectedAddress.value !== 'new') {
    const address = normalizedUserAddresses.value.find(a => a.id === selectedAddress.value);
    if (address) {
      Object.assign(shipping, {
        type: address.type || 'home',
        street_line: address.street_line || '',
        landmark: address.landmark || '',
        city: address.city || 'Cotonou',
        state_province: address.state_province || '',
        postal_code: address.postal_code || '',
        country_code: address.country_code || 'BJ',
        phone: address.phone || '',
        is_default: address.is_default || false
      });
    }
  }
  
  // Reset shipping method when address changes
  shipping.method = '';
}

// Fixed submitOrder method for CheckoutPage.vue
async function submitOrder() {
  try {
    loading.value = true;
    errorMessage.value = '';
    
    // 1. Validation du panier
    if (!cartStore.currentCartId && cartItems.value.length === 0) {
      throw new Error("Votre panier est vide");
    }

    // 2. Synchronisation du panier avec le serveur si nécessaire
    if (!cartStore.currentCartId) {
      await cartStore.syncCartWithServer(false);
    }

    // 3. Sauvegarde de l'adresse si nouvelle
    let addressId = selectedAddress.value;
    if (selectedAddress.value === 'new' || !selectedAddress.value) {
      const newAddress = {
        type: shipping.type,
        street_line: shipping.street_line,
        landmark: shipping.landmark,
        city: shipping.city,
        state_province: shipping.state_province,
        postal_code: shipping.postal_code,
        country_code: shipping.country_code,
        phone: shipping.phone,
        is_default: shipping.is_default
      };

      console.log('Creating new address:', newAddress);
      
      try {
        const response = await userStore.newAddress(newAddress);
        console.log('Address creation response:', response);
        
        // Handle different possible response structures
        if (response) {
          addressId = response;
        } else {
          console.error('Unexpected response structure:', response);
          throw new Error("Format de réponse inattendu lors de la création de l'adresse");
        }
        
        if (!addressId) {
          throw new Error("ID d'adresse manquant dans la réponse du serveur");
        }
        
      } catch (addressError) {
        console.error('Address creation error:', addressError);
        throw new Error(`Erreur lors de la création de l'adresse: ${addressError.message}`);
      }
    }

    // 4. Définition du prix final
    if (cartStore.setManualFinalPrice) {
      cartStore.setManualFinalPrice(orderTotal.value);
    }

    // 5. Préparation des données de paiement
    let paymentData = paymentMethod.value;
    let phoneNumber = null;
    
    if (shipping.method === 'local_standard') {
      paymentData = 'cash_on_delivery';
    } else if (paymentMethod.value === 'mobile_money') {
      phoneNumber = mobilePayment.phone;
    }

    console.log('Submitting order with:', {
      addressId,
      paymentData,
      phoneNumber,
      shippingMethod: shipping.method
    });

    // 6. Création de la commande
    const response = await orderStore.createOrder(
      addressId, 
      paymentData, 
      phoneNumber,
      subtotal.value,
      shippingCost.value
    );

    console.log('Ma response', response)
    

    // 7. Gestion de la réponse
    if (response.data.data.payment_token.payment_url) {
      // Redirection vers le paiement en ligne
      window.location.href = response.data.data.payment_token.payment_url;
    } else {
      // Succès mais pas d'URL de paiement
      currentStep.value = 3;
    }
    
  } catch (error) {
    console.error('Erreur lors de la création de la commande:', error);
    
    // Provide more specific error messages
    let errorMsg = error.message;
    if (error.response?.data?.message) {
      errorMsg = error.response.data.message;
    } else if (error.response?.data?.errors) {
      const errors = Object.values(error.response.data.errors).flat();
      errorMsg = errors.join(', ');
    }
    
    errorMessage.value = errorMsg || "Une erreur est survenue lors de la création de la commande. Veuillez réessayer.";
    setTimeout(() => errorMessage.value = '', 8000);
  } finally {
    loading.value = false;
  }
}

function trackOrder() {
  router.push(`/orders/${orderNumber.value}`);
}

function continueShopping() {
  router.push('/shop');
}

// Watch pour reset le numéro quand le pays change
watch(() => mobilePayment.countryCode, (newCountry) => {
  mobilePayment.phone = ''; // Reset le numéro quand le pays change
});

// Lifecycle
onMounted(async () => {
  try {
    // Chargement des pays
    if (uiStore.getCountries) {
      await uiStore.getCountries();
      countries.value = uiStore.countries || [];
    }
    
    // Chargement des items du panier
    if (cartStore.items) {
      cartItems.value = cartStore.items;
    }
    
    // Auto-sélection de la première adresse si disponible
    if (normalizedUserAddresses.value.length > 0) {
      selectedAddress.value = normalizedUserAddresses.value[0].id;
      onAddressSelect();
    }
    
  } catch (error) {
    console.error('Erreur lors du chargement des données:', error);
    errorMessage.value = "Erreur lors du chargement. Veuillez actualiser la page.";
  }
});
</script>

<style scoped>
.fade-slide-enter-active, .fade-slide-leave-active {
  transition: all 0.4s ease;
}

.fade-slide-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}

.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

input:focus {
  transform: translateY(-1px);
}

.border-3 {
  border-width: 3px;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: .5;
  }
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
</style>