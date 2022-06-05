<template>
  <div class="cs__app mx-auto px-2 pt-40 flex flex-col">
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
  font-family: Montserrat, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: $green-darker;
  font-size: 14px;
}

.cs__app {
  min-height: 100vh;
  max-width: 500px;
  background-color: $green-lighter;

  &__logo {
    width: 120px;
    height: 120px;
  }
}
</style>
