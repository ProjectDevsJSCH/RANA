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
                @pointerdown="onEdit"
              >
                <img
                  :src="require('@/assets/icons/edit.svg')"
                  alt=""
                  class="block w-5 h-5"
                >
              </button>
              <p class="overflow-hidden text-4xl font-bold text-ellipsis">{{ currentPlayer.name }}</p>
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
                  <p>{{ currentRound }}</p>
                </div>
              </div>
              <div>
                <p
                  v-if="nextPlayerName"
                  class="mt-2 text-xs italic text-center"
                >
                  Siguiente: <span class="font-bold">{{ nextPlayerName }}</span>
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
          <div v-if="winner === ''">
            <p class="text-base font-bold text-center">Ronda terminada</p>
            <ButtonComponent
              buttonClass="mx-auto block mt-3"
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
            <p class="text-4xl font-bold text-center">{{ winner }}</p>
            <VueLottiePlayer
              loop
              :animationData="require('@/assets/animations/winner.json')"
            />
          </div>
        </div>
      </div>
    </transition>
    <ButtonComponent
      v-if="!hasFinishedRound"
      buttonClass="mx-auto block my-2 mt-14"
      :disabled="!inputScore"
      @onClick="nextTurn"
    >
      <p>Siguiente turno</p>
    </ButtonComponent>
    <ButtonComponent
      buttonClass="mx-auto block mt-2"
      @onClick="displayPositions"
    >
      <p>Posiciones</p>
    </ButtonComponent>
    <ButtonComponent
      buttonClass="mx-auto block mt-3"
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

import { GameApi } from '@/api/game.api';
import { PlayerApi } from '@/api/player.api';
import { PlayerStore } from '@/model/tables/player.model';
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
    const state = reactive({
      displayPlayer: false,
      hasFinishedRound: false,
      currentPlayer: {} as PlayerStore,
      showModal: false,
      inputPlayerName: '',
      currentRound: -1,
      nextPlayerName: '' as string | undefined,
      inputScore: '',
      winner: '',
    });
    const linkPlayer = computed(() => `https://api.dicebear.com/7.x/thumbs/svg?backgroundType=gradientLinear&seed=${state.currentPlayer.name}`);

    onBeforeMount(async () => {
      try {
        state.currentPlayer = await GameApi.getCurrentPlayer();
        state.currentRound = await GameApi.getCurrentRound();
        state.nextPlayerName = await GameApi.getNextPlayerName();
      } catch (error) {
        console.error(error);
      }

      setTimeout(() => {
        state.displayPlayer = true;
      }, 200);
    });

    const onEdit = (): void => {
      state.showModal = true;
      state.inputPlayerName = state.currentPlayer.name;
    };

    const nextTurn = async (): Promise<void> => {
      state.displayPlayer = false;

      try {
        state.currentPlayer = await GameApi.setNextTurn(+state.inputScore);
        state.currentRound = await GameApi.getCurrentRound();
        state.nextPlayerName = await GameApi.getNextPlayerName();
      } catch (error) {
        console.error(error);
      }

      state.inputScore = '';

      if (state.currentPlayer.position === 1) {
        state.hasFinishedRound = true;
        state.winner = await GameApi.checkGameWinner();
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
        await PlayerApi.updatePlayerName(state.currentPlayer.idPlayer, state.inputPlayerName);
        emit('updatePositionsList');

        state.currentPlayer.name = state.inputPlayerName;
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
      onEdit,
      linkPlayer,
      nextTurn,
      onCloseModal,
      continueNextRound,
      updatePlayer,
      displayPositions,
      moreOptions,
    };
  },
});
</script>

<style lang='scss' scoped>
</style>
