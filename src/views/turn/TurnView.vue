<template>
  <div class="flex flex-1">
    <div class="flex items-center justify-center flex-1 overflow-hidden">
      <div class="flex flex-col items-center">
        <transition name="slide">
          <div
            v-if="displayPlayer"
            class="mt-10"
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
                <p
                  v-if="nextPlayerName"
                  class="mt-2 text-xs italic"
                >
                  Se prepara <span class="font-bold">{{ nextPlayerName }}</span>
                </p>
                <p
                  v-else
                  class="font-bold"
                >
                  Último jugador
                </p>
              </div>
              <div class="flex items-center justify-center mt-5">
                <img
                  class="w-40 h-40 p-2 m-3 bg-white rounded-full"
                  :src="linkPlayer"
                  alt="Jugador actual"
                >
                <div class="flex justify-between p-2 mt-4 font-bold text-center bg-white rounded drop-shadow-lg">
                  <div class="mr-4 text-left">
                    <p>Puntaje total</p>
                    <p>Ronda</p>
                  </div>
                  <div>
                    <p>{{ totalScore }}</p>
                    <p>{{ currentRound }}</p>
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
              <p class="text-base font-bold text-center">Ronda terminada</p>
              <ButtonComponent
                buttonClass="mx-auto block mt-3"
                @onClick="continueNextRound"
              >
                Continuar
              </ButtonComponent>
            </div>
          </div>
        </transition>

        <ButtonComponent
          v-if="!hasFinishedRound"
          buttonClass="mx-auto block my-3 mt-10"
          :disabled="!inputScore"
          @onClick="nextTurn"
        >
          <p>Siguiente turno</p>
        </ButtonComponent>
        <ButtonComponent
          buttonClass="mx-auto block mt-3"
          @onClick="moveToPositions"
        >
          <p>Posiciones</p>
        </ButtonComponent>
      <!-- <ButtonComponent
        buttonClass="mx-auto block mt-3"
        :disabled="true"
        >
        <p>Saltar</p>
      </ButtonComponent> -->
      </div>
    </div>
    <transition name="slide">
      <PositionsList
        ref="positionsList"
        :showPositions="showPositions"
        @onClosePositions="showPositions = false"
      />
    </transition>
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
  defineComponent,
  onBeforeMount,
  reactive,
  toRefs,
  computed,
  ref,
} from 'vue';

import { GameApi } from '@/api/game.api';
import { PlayerApi } from '@/api/player.api';
import PositionsList from '@/components/positions-list/PositionsList.vue';
import { PlayerStore } from '@/model/tables/player.model';
import ButtonComponent from '@/ui-components/button-component/ButtonComponent.vue';
import InputComponent from '@/ui-components/input-component/InputComponent.vue';
import ModalComponent from '@/ui-components/modal-component/ModalComponent.vue';

export default defineComponent({
  components: {
    InputComponent,
    ButtonComponent,
    ModalComponent,
    PositionsList,
  },
  setup() {
    const state = reactive({
      currentPlayer: {} as PlayerStore,
      inputPlayerName: '',
      nextPlayerName: '' as string | undefined,
      inputScore: '',
      totalScore: 0,
      currentRound: -1,
      displayPlayer: false,
      hasFinishedRound: false,
      showPositions: false,
      showModal: false,
    });

    const positionsList = ref<InstanceType<typeof PositionsList> | null>(null);
    const linkPlayer = computed(() => `https://api.dicebear.com/7.x/thumbs/svg?backgroundType=gradientLinear&seed=${state.currentPlayer.name}`);

    onBeforeMount(async () => {
      try {
        state.currentPlayer = await GameApi.getCurrentPlayer();
        state.currentRound = await GameApi.getCurrentRound();
        state.totalScore = state.currentPlayer.totalScore;
        state.nextPlayerName = await GameApi.getNextPlayerName();
      } catch (error) {
        console.error(error);
      }

      setTimeout(() => {
        state.displayPlayer = true;
      }, 200);
    });

    const nextTurn = async (): Promise<void> => {
      state.displayPlayer = false;

      try {
        state.currentPlayer = await GameApi.setNextTurn(+state.inputScore);
        state.totalScore = state.currentPlayer.totalScore;
        state.currentRound = await GameApi.getCurrentRound();
        state.nextPlayerName = await GameApi.getNextPlayerName();
      } catch (error) {
        console.error(error);
      }

      state.inputScore = '';
      positionsList.value?.updatePositionsList();

      if (state.currentPlayer.position === 1) {
        state.hasFinishedRound = true;
      }

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

    const displayPositions = (): void => {
      state.showPositions = true;
    };

    const onCloseModal = (): void => {
      state.showModal = false;
    };

    const updatePlayer = async (): Promise<void> => {
      if (state.inputPlayerName === '') return;

      state.showModal = false;

      try {
        await PlayerApi.updatePlayerName(state.currentPlayer.idPlayer, state.inputPlayerName);
        await positionsList.value?.updatePositionsList();

        state.currentPlayer.name = state.inputPlayerName;
      } catch (error) {
        console.error(error);
      }
    };

    const onEdit = (): void => {
      state.showModal = true;
      state.inputPlayerName = state.currentPlayer.name;
    };

    return {
      ...toRefs(state),
      linkPlayer,
      positionsList,
      nextTurn,
      continueNextRound,
      onCloseModal,
      updatePlayer,
      onEdit,
      moveToPositions: displayPositions,
    };
  },
});
</script>
