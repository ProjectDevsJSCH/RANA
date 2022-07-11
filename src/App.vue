<template>
  <div class="flex flex-col p-2 pb-20 mx-auto cs__app">
    <img :class="[homeView ? 'mt-40' : 'cs__app__logo--small', 'cs__app__logo mx-auto cursor-pointer']"
         :src="require('@/assets/icons/frontal-frog.svg')"
         alt="Rana"
         @click="routeHome"
         @keypress="home"
    >
    <router-view />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onBeforeMount } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import { dbInitializer } from './db/initializer';

export default defineComponent({
  name: 'App',
  setup() {
    const route = useRoute();
    const router = useRouter();

    const homeView = computed(() => route.name === 'HomeView');

    onBeforeMount(async () => {
      await dbInitializer();
    });

    const routeHome = (): void => {
      router.push({ name: 'HomeView' });
    };

    const home = (event: KeyboardEvent): void => {
      if (event.key === 'h') {
        routeHome();
      }
    };

    return {
      homeView,
      routeHome,
      home,
    };
  },
});
</script>

<style lang="scss">
@import '@/assets/styles/variables';

#app {
  font-family: Montserrat, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: $erie-black;
  font-size: 14px;
}

.cs__app {
  min-height: 100vh;
  max-width: 500px;
  background-color: $alabaster;

  &__logo {
    width: 120px;
    height: 120px;
    transition: all 0.3s ease-in-out;

    &--small {
      width: 60px;
      height: 60px;
      transition: all 0.3s ease-in-out;
    }
  }
}
</style>
