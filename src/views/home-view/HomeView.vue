<template>
  <div class="flex flex-col items-center justify-center flex-1 cs__home">
    <transition name="show">
      <div v-if="!isLoading" class="flex flex-col items-center">
        <ButtonComponent
          class="mb-4 text-center"
          aria-label="Iniciar juego nuevo"
          @onClick="newGame"
        >
          <span>Juego nuevo</span>
        </ButtonComponent>

        <transition name="show">
          <ButtonComponent
            v-if="isThereAnActiveGame"
            class="text-center"
            aria-label="Continuar juego activo"
            @onClick="continueGame"
          >
            <span>Continuar juego</span>
          </ButtonComponent>
        </transition>
      </div>
    </transition>

    <transition name="show">
      <div v-if="isLoading" class="cs__home__loader">
        <div class="cs__spinner" />
      </div>
    </transition>
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
      isLoading: true,
    });

    const router = useRouter();

    onBeforeMount(async () => {
      try {
        state.isThereAnActiveGame = await GameApi.checkIfGameIsPlaying();
      } catch (err) {
        console.error('Error checking game state:', err);
      } finally {
        state.isLoading = false;
      }
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

<style lang="scss" scoped>
@import '@/assets/styles/variables';

.cs__home {
  &__loader {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 40px;
  }
}

.cs__spinner {
  width: 36px;
  height: 36px;
  border: 3px solid $shadow;
  border-top-color: $accent;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>
