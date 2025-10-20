<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
    <!-- Header Luxe -->
    <header class="bg-white/95 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
      <div class="max-w-7xl mx-auto px-6 py-4">
        <div class="flex justify-between items-center">
          <router-link to="/" class="flex items-center space-x-4 group">
            <div class="w-12 h-12 bg-gradient-to-r from-black to-gray-800 rounded-full flex items-center justify-center">
              <span class="text-white font-bold text-lg tracking-wider">B</span>
            </div>
            <div>
              <h1 class="text-2xl font-serif font-bold text-gray-900 tracking-tight">bylin</h1>
              <p class="text-xs text-gray-500 tracking-widest uppercase">LUXURY FASHION</p>
            </div>
          </router-link>
          
          <nav class="flex space-x-8">
            <router-link 
              v-for="link in legalLinks"
              :key="link.to"
              :to="link.to"
              class="text-sm font-medium transition-all duration-300 relative py-2"
              :class="route.path === link.to 
                ? 'text-gray-900 font-semibold' 
                : 'text-gray-600 hover:text-gray-900'"
            >
              {{ link.text }}
              <div 
                v-if="route.path === link.to"
                class="absolute bottom-0 left-0 w-full h-0.5 bg-gray-900"
              ></div>
            </router-link>
          </nav>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="max-w-6xl mx-auto py-16 px-6">
      <div class="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/60 overflow-hidden">
        <!-- En-tête avec navigation rapide -->
        <div class="border-b border-gray-200/60 bg-gradient-to-r from-gray-50 to-white">
          <div class="px-10 py-8">
            <div class="flex items-center justify-between">
              <div>
                <h1 class="text-4xl font-serif font-bold text-gray-900 mb-3">
                  <slot name="title"></slot>
                </h1>
                <p class="text-gray-600 text-lg max-w-3xl">
                  <slot name="description"></slot>
                </p>
              </div>
              <div class="text-right">
                <div class="inline-flex items-center px-4 py-2 rounded-full bg-blue-50 border border-blue-200">
                  <Calendar class="w-4 h-4 text-blue-600 mr-2" />
                  <span class="text-sm font-medium text-blue-700">
                    Dernière mise à jour : <slot name="last-updated"></slot>
                  </span>
                </div>
              </div>
            </div>
            
            <!-- Navigation rapide -->
            <nav v-if="sections.length" class="mt-6 flex flex-wrap gap-3">
              <a
                v-for="section in sections"
                :key="section.id"
                :href="`#${section.id}`"
                class="inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200"
                :class="activeSection === section.id 
                  ? 'bg-gray-900 text-white shadow-lg' 
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300 shadow-sm'"
              >
                {{ section.title }}
              </a>
            </nav>
          </div>
        </div>
        
        <!-- Contenu -->
        <div class="px-10 py-12">
          <div class="max-w-5xl legal-content">
            <slot name="content"></slot>
          </div>
        </div>
      </div>
    </main>

    <!-- Footer Premium -->
    <footer class="bg-gray-900 text-white mt-20">
      <div class="max-w-7xl mx-auto px-6 py-12">
        <div class="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <!-- Brand -->
          <div class="lg:col-span-1">
            <div class="flex items-center space-x-3 mb-4">
              <div class="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                <span class="text-gray-900 font-bold text-lg">B</span>
              </div>
              <span class="text-xl font-serif font-bold">bylin</span>
            </div>
            <p class="text-gray-400 text-sm leading-relaxed">
              Marque de luxe internationale, alliant élégance et innovation depuis 2020.
            </p>
          </div>

          <!-- Liens légaux -->
          <div>
            <h3 class="font-semibold text-white mb-4">Légal</h3>
            <div class="space-y-3">
              <router-link 
                v-for="link in legalLinks"
                :key="`footer-${link.to}`"
                :to="link.to"
                class="block text-gray-400 hover:text-white transition-colors text-sm"
              >
                {{ link.text }}
              </router-link>
            </div>
          </div>

          <!-- Contact -->
          <div>
            <h3 class="font-semibold text-white mb-4">Contact</h3>
            <div class="space-y-3 text-sm text-gray-400">
              <p>📧 legal@bylin-style.com</p>
              <p>📞 +229 51 01 04 42</p>
              <p>🏛️ Cotonou, Bénin</p>
            </div>
          </div>

          <!-- Devises -->
          <div>
            <h3 class="font-semibold text-white mb-4">Devises acceptées</h3>
            <div class="flex flex-wrap gap-2">
              <span class="px-3 py-1 bg-gray-800 rounded-full text-xs text-gray-300">FCFA</span>
              <span class="px-3 py-1 bg-gray-800 rounded-full text-xs text-gray-300">EUR €</span>
              <span class="px-3 py-1 bg-gray-800 rounded-full text-xs text-gray-300">USD $</span>
              <span class="px-3 py-1 bg-gray-800 rounded-full text-xs text-gray-300">GBP £</span>
            </div>
          </div>
        </div>

        <div class="border-t border-gray-800 mt-8 pt-8 text-center">
          <p class="text-gray-400 text-sm">
            © 2015-2025 bylin International. Tous droits réservés. 
            <span class="mx-2">•</span>
            Marque déposée worldwide.
          </p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import { Calendar } from 'lucide-vue-next'

const route = useRoute()
const activeSection = ref('')

const legalLinks = [
  { to: '/privacy', text: 'Confidentialité' },
  { to: '/terms', text: 'Conditions Générales' },
  { to: '/cookies', text: 'Politique Cookies' },
  { to: '/shipping', text: 'Livraison & Retours' },
  { to: '/intellectual-property', text: 'Propriété Intellectuelle' },
]

const sections = ref([])

const handleScroll = () => {
  const scrollPosition = window.scrollY + 100
  
  for (const section of sections.value) {
    const element = document.getElementById(section.id)
    if (element) {
      const offsetTop = element.offsetTop
      const offsetHeight = element.offsetHeight
      
      if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
        activeSection.value = section.id
        break
      }
    }
  }
}

const extractSections = () => {
  const contentElement = document.querySelector('.legal-content')
  if (contentElement) {
    const headings = contentElement.querySelectorAll('h2')
    sections.value = Array.from(headings).map((heading, index) => ({
      id: `section-${index + 1}`,
      title: heading.textContent
    }))
  }
}

onMounted(() => {
  setTimeout(extractSections, 100)
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})

defineExpose({ sections })
</script>

<style scoped>
.legal-content {
  line-height: 1.75;
}

.legal-content :deep(h2) {
  color: #111827;
  font-weight: 700;
  font-size: 1.75rem;
  margin-top: 3rem;
  margin-bottom: 1.5rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid #f3f4f6;
  scroll-margin-top: 100px;
}

.legal-content :deep(h3) {
  color: #374151;
  font-weight: 600;
  font-size: 1.25rem;
  margin-top: 2rem;
  margin-bottom: 1rem;
}

.legal-content :deep(h4) {
  color: #4b5563;
  font-weight: 500;
  font-size: 1.1rem;
  margin-top: 1.5rem;
  margin-bottom: 0.75rem;
}

.legal-content :deep(p) {
  margin-bottom: 1.25rem;
  line-height: 1.75;
  color: #4b5563;
}

.legal-content :deep(ul) {
  margin-bottom: 1.5rem;
  padding-left: 1.5rem;
}

.legal-content :deep(li) {
  margin-bottom: 0.75rem;
  line-height: 1.75;
  color: #4b5563;
  position: relative;
}

.legal-content :deep(li:before) {
  content: "•";
  color: #d1d5db;
  font-weight: bold;
  display: inline-block;
  width: 1em;
  margin-left: -1em;
}

.legal-content :deep(strong) {
  font-weight: 600;
  color: #374151;
}

.legal-content :deep(a) {
  color: #2563eb;
  text-decoration: none;
  font-weight: 500;
}

.legal-content :deep(a:hover) {
  text-decoration: underline;
}

.legal-content :deep(.highlight) {
  background: #fffbeb;
  border-left: 4px solid #f59e0b;
  padding: 1.5rem;
  border-radius: 0.5rem;
  margin: 1.5rem 0;
}

.legal-content :deep(.note) {
  background: #f0f9ff;
  border-left: 4px solid #0ea5e9;
  padding: 1rem 1.5rem;
  border-radius: 0.5rem;
  margin: 1.5rem 0;
}
</style>