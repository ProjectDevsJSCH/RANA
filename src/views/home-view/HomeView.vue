<template>
  <div class="cs__home flex-1 flex items-center justify-center">
    <div>
      <ButtonComponent
        class="mb-4 text-center"
        @onClick="newGame"
      >
        <span>Juego nuevo</span>
      </ButtonComponent>

      <ButtonComponent
        class="text-center"
        @onClick="continueGame"
      >
        <span>Continuar juego</span>
      </ButtonComponent>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useRouter } from 'vue-router';

import ButtonComponent from '@/components/button-component/ButtonComponent.vue';

export default defineComponent({
  name: 'HomeView',
  components: { ButtonComponent },
  setup() {
    const router = useRouter();

    const newGame = () => {
      router.push({ name: 'NewGame' });
    };

    const continueGame = () => {
      console.log('w');
    };

    return { newGame, continueGame };
  },
});
</script>
