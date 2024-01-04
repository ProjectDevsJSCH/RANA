<template>
  <div
    class="relative flex flex-col p-2 px-2 pb-10 mx-auto overflow-hidden cs__app"
    :style="{ height: `${innerHeight}px` }"
  >
    <img
      :class="[homeView ? 'mt-40' : 'cs__app__logo--small', 'cs__app__logo mx-auto cursor-pointer']"
      :src="require('@/assets/icons/frontal-frog.svg')"
      alt="Rana"
      @click="routeHome"
      @keypress="home"
    >
    <router-view v-slot="{Component}">
      <component :is="Component" />
    </router-view>
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
    const innerHeight = computed(() => window.innerHeight);

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
      innerHeight,
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
  color: $dark;
  font-size: 14px;
  flex: 1;
}

.cs__app {
  max-width: 500px;
  background-image: linear-gradient(180deg, rgba(100, 100, 100, 0.063) 0%, rgba(100, 100, 100, 0.165) 100%);

  &__logo {
    width: 120px;
    height: 120px;
    transition: all 0.5s ease-in-out;

    &--small {
      width: 60px;
      height: 60px;
      transition: all 0.5s ease-in-out;
    }
  }
}
</style>
