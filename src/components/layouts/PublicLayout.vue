<template>
  <div class="public-layout">
    <SeoHead />

    <header class="bg-white">
      <NavBarComponent />
    </header>

    <main>
      <router-view />
    </main>

    <footer>
      <FooterComponent />
    </footer>
  </div>
</template>

<script setup>
import FooterComponent from './Public/FooterComponent.vue'
import NavBarComponent from './Public/NavBarComponent.vue'
import SeoHead from '@/components/seo/SeoHead.vue'
</script>

<style scoped>
.public-layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}
main {
  flex-grow: 1;
}
</style>
