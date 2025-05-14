<template>
  <div id="app">
    <a href="https://vite.dev" target="_blank">
      <img src="/vite.svg" class="logo" alt="Vite logo" />
    </a>
    <h1>{{ charName }}</h1>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';

export default defineComponent({
  setup() {
    // Try to read 'charName' from localStorage; fallback to 'Your Character'
    const stored = localStorage.getItem('charName');
    const charName = ref(stored || 'Your Character');

    return { charName };
  }
});
</script>

<style>
#app {
  font-family: sans-serif;
  text-align: center;
  margin-top: 2rem;
}
</style>
