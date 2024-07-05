<script setup lang="ts">
import { ref } from 'vue'
import ReferencesSection from './ReferencesSection.vue'
import DemoSection from './DemoSection.vue'

enum Views {
  references = 'references',
  demo = 'demo'
}

const activeView = ref(Views.references)
</script>

<template>
  <div id="container">
    <header>
      <img
        alt="Vue logo"
        class="logo"
        src="@/assets/images/logo-and-lettering.svg"
        width="200"
        height="200"
      />

      <div class="wrapper">
        <h1>Welcome padawan</h1>
        <nav>
          <a href="javascript:void(0)" @click="activeView = Views.references">References</a>
          <a href="javascript:void(0)" @click="activeView = Views.demo">Demo</a>
        </nav>
      </div>
    </header>
    <div>
      <ReferencesSection v-if="activeView === Views.references" />
      <DemoSection v-if="activeView === Views.demo" />
    </div>
  </div>
</template>

<style scoped lang="scss">
header {
  line-height: 1.5;
  max-height: 100vh;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

nav {
  display: flex;
  width: 100%;
  text-align: center;
  margin-top: 2rem;
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid $color-grey-7;
}

nav a:first-of-type {
  border: 0;
}

#container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 2rem;
  font-weight: normal;
}

@media (min-width: 1024px) {
  #container {
    display: grid;
    grid-template-columns: 40em auto;
    align-items: center;
    height: 100%;
    padding: 0 2rem;

    header {
      display: flex;
      place-items: center;
      padding-right: $spacing-xxl;
      flex-grow: 2;
    }

    .logo {
      margin: 0 2rem 0 0;
    }

    header .wrapper {
      display: flex;
      place-items: flex-start;
      flex-wrap: wrap;
    }

    nav {
      text-align: left;
      margin-left: -1rem;
      font-size: 1rem;

      padding: 1rem 0;
      margin-top: 1rem;
    }
  }
}
</style>
