<template>
  <div class="cs__app mx-auto px-2 py-10">
    <img class="cs__app__logo mx-auto"
         :src="require('@/assets/icons/frontal-frog.svg')"
         alt="Rana"
    >
    <router-view />
  </div>
</template>

<style lang="scss">
@import '@/assets/styles/variables';

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

.cs__app {
  min-height: 100vh;
  max-width: 500px;
  background-color: $gray-light;

  &__logo {
    width: 120px;
    height: 120px;
  }
}
</style>
