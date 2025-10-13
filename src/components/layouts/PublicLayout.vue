<!-- src/layouts/PublicLayout.vue -->
<template>
  <div class="public-layout">
    <header class="bg-white">
      <!-- header commun public -->
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
import FooterComponent from './Public/FooterComponent.vue';
import NavBarComponent from './Public/NavBarComponent.vue';

// Pas forcément besoin de script ici pour un layout simple
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
