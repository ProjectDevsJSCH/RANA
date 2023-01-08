<template>
  <div class="flex flex-col items-center justify-center flex-1 cs__home">
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
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useRouter } from 'vue-router';

import { GameApi } from '@/api/game.api';
import { PlayerApi } from '@/api/player.api';
import ButtonComponent from '@/ui-components/button-component/ButtonComponent.vue';

export default defineComponent({
  name: 'HomeView',
  components: { ButtonComponent },
  setup() {
    const router = useRouter();

    const newGame = async (): Promise<void> => {
      await PlayerApi.cleanData();
      await GameApi.cleanData();

      router.push({ name: 'NewGame' });
    };

    const continueGame = (): void => {
      console.log('w');
    };

    return { newGame, continueGame };
  },
});
</script>
