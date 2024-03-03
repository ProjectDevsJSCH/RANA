<template>
  <div class="flex flex-col items-center justify-center flex-1 cs__home">
    <ButtonComponent
      class="mb-4 text-center"
      :appendExitTransition="true"
      @onClick="newGame"
    >
      <span>Juego nuevo</span>
    </ButtonComponent>

    <ButtonComponent
      v-if="isThereAnActiveGame"
      class="text-center"
      @onClick="continueGame"
    >
      <span>Continuar juego</span>
    </ButtonComponent>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  reactive,
  toRefs,
  onBeforeMount,
} from 'vue';
import { useRouter } from 'vue-router';

import { GameApi } from '@/api/game.api';
import { PlayerApi } from '@/api/player.api';
import ButtonComponent from '@/ui-components/button-component/ButtonComponent.vue';

export default defineComponent({
  name: 'HomeView',
  components: { ButtonComponent },
  setup() {
    const state = reactive({
      isThereAnActiveGame: false,
    });

    const router = useRouter();

    onBeforeMount(async () => {
      state.isThereAnActiveGame = await GameApi.checkIfGameIsPlaying();
    });

    const newGame = async (): Promise<void> => {
      await PlayerApi.cleanData();
      await GameApi.cleanData();

      router.push({ name: 'NewGame' });
    };

    const continueGame = (): void => {
      router.push({ name: 'CurrentTurn' });
    };

    return {
      ...toRefs(state),
      newGame,
      continueGame,
    };
  },
});
</script>
