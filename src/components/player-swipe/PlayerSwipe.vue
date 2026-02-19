<template>
  <div>
    <transition name="slide">
      <div
        v-if="displayPlayer"
        class="mt-5"
      >
        <div v-if="!hasFinishedRound">
          <div class="text-center">
            <p class="text-2xl">Turno de</p>
            <div class="flex items-center justify-center">
              <button
                class="px-3"
                aria-label="Editar nombre del jugador"
                @pointerdown="onEdit"
              >
                <img
                  :src="require('@/assets/icons/edit.svg')"
                  alt="Editar"
                  class="block w-5 h-5"
                >
              </button>
              <p class="overflow-hidden text-4xl font-bold text-ellipsis">{{ gameCurrentPlayer.name }}</p>
            </div>
          </div>
          <div class="flex items-center justify-center mt-5 drop-shadow-lg">
            <img
              class="z-20 w-40 h-40 p-2 m-3 -mr-6 bg-white rounded-full"
              :src="linkPlayer"
              alt="Jugador actual"
            >
            <div class="flex flex-col justify-between max-w-[200px] p-2 pl-6 text-center bg-white rounded-xl drop-shadow-lg">
              <div class="flex">
                <div class="mr-4 font-bold text-right">
                  <p>Ronda</p>
                </div>
                <div class="text-left">
                  <p>{{ gameCurrentRound }}</p>
                </div>
              </div>
              <div>
                <p
                  v-if="gameNextPlayerName"
                  class="mt-2 text-xs italic text-center"
                >
                  Siguiente: <span class="font-bold">{{ gameNextPlayerName }}</span>
                </p>
                <p
                  v-else
                  class="font-bold"
                >
                  Último jugador
                </p>
              </div>
            </div>
          </div>
          <InputComponent
            v-model="inputScore"
            placeholder="0"
            class="mx-auto mt-5 w-60"
            :inputType="'number'"
            @keyup.enter="nextTurn"
          >
            <template #label>
              <span class="font-bold">Puntaje</span>
            </template>
          </InputComponent>
        </div>
        <div v-else>
          <div v-if="gameWinner === ''">
            <p class="text-base font-bold text-center">Ronda terminada</p>
            <ButtonComponent
              buttonClass="mx-auto block mt-3"
              aria-label="Continuar a la siguiente ronda"
              @onClick="continueNextRound"
            >
              Continuar
            </ButtonComponent>
          </div>
          <div
            v-else
            class="my-5"
          >
            <p class="text-2xl font-bold text-center">Ganador</p>
            <p class="text-4xl font-bold text-center">{{ gameWinner }}</p>
            <VueLottiePlayer
              loop
              :animationData="require('@/assets/animations/winner.json')"
            />
          </div>
        </div>
      </div>
    </transition>

    <!-- Loading indicator -->
    <transition name="show">
      <div v-if="gameIsLoading" class="flex items-center justify-center py-8">
        <div class="cs__spinner" />
      </div>
    </transition>

    <!-- Error message -->
    <transition name="show">
      <div v-if="gameError" class="cs__error-banner">
        <p>{{ gameError }}</p>
        <button aria-label="Cerrar error" @click="clearError">✕</button>
      </div>
    </transition>

    <ButtonComponent
      v-if="!hasFinishedRound"
      buttonClass="mx-auto block my-2 mt-14"
      :disabled="!inputScore"
      aria-label="Avanzar al siguiente turno"
      @onClick="nextTurn"
    >
      <p>Siguiente turno</p>
    </ButtonComponent>
    <ButtonComponent
      buttonClass="mx-auto block mt-2"
      aria-label="Ver posiciones"
      @onClick="displayPositions"
    >
      <p>Posiciones</p>
    </ButtonComponent>
    <ButtonComponent
      buttonClass="mx-auto block mt-3"
      aria-label="Más opciones"
      @onClick="moreOptions"
    >
      <p>Más</p>
    </ButtonComponent>
    <ModalComponent
      containerClass="p-8 w-80"
      :showModal="showModal"
      @onCloseModal="onCloseModal"
    >
      <InputComponent v-model="inputPlayerName">
        <template #label>
          <span class="font-bold">Nombre</span>
        </template>
      </InputComponent>
      <ButtonComponent
        class="block mx-auto mt-6 text-center"
        aria-label="Guardar edición del jugador"
        @onClick="updatePlayer"
      >
        <span>Editar jugador</span>
      </ButtonComponent>
    </ModalComponent>
  </div>
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  reactive,
  toRefs,
  onBeforeMount,
} from 'vue';
import VueLottiePlayer from 'vue-lottie-player';

import { PlayerApi } from '@/api/player.api';
import { useGame } from '@/composables/useGame';
import ButtonComponent from '@/ui-components/button-component/ButtonComponent.vue';
import InputComponent from '@/ui-components/input-component/InputComponent.vue';
import ModalComponent from '@/ui-components/modal-component/ModalComponent.vue';

export default defineComponent({
  components: {
    VueLottiePlayer,
    InputComponent,
    ButtonComponent,
    ModalComponent,
  },
  name: 'PlayerSwipe',
  setup(_, { emit }) {
    const {
      currentPlayer: gameCurrentPlayer,
      currentRound: gameCurrentRound,
      nextPlayerName: gameNextPlayerName,
      winner: gameWinner,
      isLoading: gameIsLoading,
      error: gameError,
      loadGameState,
      advanceTurn,
      checkWinner,
      clearError,
    } = useGame();

    const state = reactive({
      displayPlayer: false,
      hasFinishedRound: false,
      showModal: false,
      inputPlayerName: '',
      inputScore: '',
    });

    const linkPlayer = computed(() => `https://api.dicebear.com/7.x/thumbs/svg?backgroundType=gradientLinear&seed=${gameCurrentPlayer.value.name}`);

    onBeforeMount(async () => {
      await loadGameState();

      setTimeout(() => {
        state.displayPlayer = true;
      }, 200);
    });

    const onEdit = (): void => {
      state.showModal = true;
      state.inputPlayerName = gameCurrentPlayer.value.name;
    };

    const nextTurn = async (): Promise<void> => {
      state.displayPlayer = false;

      await advanceTurn(+state.inputScore);
      state.inputScore = '';

      if (gameCurrentPlayer.value.position === 1) {
        state.hasFinishedRound = true;
        await checkWinner();
      }

      emit('updatePositionsList');

      setTimeout(() => {
        state.displayPlayer = true;
      }, 200);
    };

    const continueNextRound = (): void => {
      state.hasFinishedRound = false;
      state.displayPlayer = false;

      setTimeout(() => {
        state.displayPlayer = true;
      }, 200);
    };

    const onCloseModal = (): void => {
      state.showModal = false;
    };

    const updatePlayer = async (): Promise<void> => {
      if (state.inputPlayerName === '') return;

      state.showModal = false;

      try {
        await PlayerApi.updatePlayerName(gameCurrentPlayer.value.idPlayer, state.inputPlayerName);
        emit('updatePositionsList');

        gameCurrentPlayer.value.name = state.inputPlayerName;
      } catch (error) {
        console.error(error);
      }
    };

    const displayPositions = (): void => {
      emit('displayPositions');
    };

    const moreOptions = (): void => {
      emit('moreOptions');
    };

    return {
      ...toRefs(state),
      gameCurrentPlayer,
      gameCurrentRound,
      gameNextPlayerName,
      gameWinner,
      gameIsLoading,
      gameError,
      onEdit,
      linkPlayer,
      nextTurn,
      onCloseModal,
      continueNextRound,
      updatePlayer,
      displayPositions,
      moreOptions,
      clearError,
    };
  },
});
</script>

<style lang='scss' scoped>
@import '@/assets/styles/variables';

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

.cs__error-banner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: $error-light;
  color: $error;
  padding: 10px 16px;
  border-radius: 12px;
  margin: 8px auto;
  max-width: 300px;
  font-size: 13px;
  font-weight: 500;

  button {
    background: none;
    border: none;
    color: $error;
    cursor: pointer;
    font-size: 16px;
    padding: 0 4px;
  }
}
</style>
