<template>
  <div id="app">
    <a href="https://vite.dev" target="_blank">
      <img src="/vite.svg" class="logo" alt="Vite logo"/>
    </a>
    <h1>
      <input v-model="charName"/>
    </h1>

    <div class="columns">
      <div class="column frame">
        <label>Campaign</label>
        <input v-model="campaign"/>
        <label>Concept</label>
        <input v-model="concept"/>
      </div>
      <div class="column frame">
        <label>Small keif</label>
        <input v-model="smallKeif"/>
        <label>Big keif</label>
        <input v-model="bigKeif"/>
        <label>Vice</label>
        <input v-model="vice"/>
      </div>
      <div class="column frame">
        <label>House</label>
        <input v-model="house"/>
        <label>Stratos</label>
        <input v-model="stratos"/>
      </div>
    </div>


    <div style="height: 10px;"></div>
    <div class="frame">
      <label>Attributes</label>
      <div class="columns">
        <div class="column">
          <label>Intelligence</label>
          <input type="number" v-model="intelligence" :min="1" :max="5" value="1"/>
          <label>Wisdom</label>
          <input type="number" v-model="wisdom" :min="1" :max="5" value="1"/>
          <label>Willpower</label>
          <input type="number" v-model="willpower" :min="1" :max="5" value="1"/>
        </div>
        <div class="column">
          <label>Magic</label>
          <input type="number" v-model="magic" :min="1" :max="5" value="1"/>
          <label>Luck</label>
          <input type="number" v-model="luck" :min="1" :max="5" value="1"/>
          <label>Body Control</label>
          <input type="number" v-model="bodyControl" :min="1" :max="5" value="1"/>
        </div>
        <div class="column">
          <label>Impressiveness</label>
          <input type="number" v-model="impressiveness" :min="1" :max="5" value="1"/>
          <label>Manipulation</label>
          <input type="number" v-model="manipulation" :min="1" :max="5" value="1"/>
          <label>Equanimity</label>
          <input type="number" v-model="equanimity" :min="1" :max="5" value="1"/>
        </div>
      </div>
    </div>

  </div>
</template>

<script lang="ts">
import {defineComponent, ref, watch} from 'vue';

export default defineComponent({
  setup() {
    // Try to read 'charName' from localStorage; fallback to 'Your Character'
    const stored = localStorage.getItem('charName');
    const charName = ref(stored || 'Your Character');

    // Watch for changes and update localStorage
    watch(charName, (newValue) => {
      localStorage.setItem('charName', newValue);
    });

    return {charName};
  }
});
</script>

<style>
#app {
  font-family: sans-serif;
  text-align: center;
  margin-top: 2rem;
}

.columns {
  display: flex;
  gap: 20px;
  justify-content: center;
}

.column {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.frame {
  border: 1px solid #ccc;
  padding: 10px;
  border-radius: 8px;
}
</style>