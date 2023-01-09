<template>
  <div class="flex flex-col items-center justify-around flex-1 overflow-hidden">
    <transition name="slide">
      <div
        v-if="displayPlayer"
        class="mt-10"
      >
        <div v-if="!hasFinishedRound">
          <div class="text-center">
            <p class="text-2xl">Turno de</p>
            <p class="overflow-hidden text-4xl font-bold w-96 text-ellipsis">{{ currentPlayer.name }}</p>
            <p class="mt-2 text-xs italic">Se prepara <span class="font-bold">{{ nextPlayerName }}</span></p>
          </div>
          <div class="flex items-center mt-5">
            <img
              class="w-40 h-40 p-3 m-3 bg-black rounded-full"
              :src="linkPlayer"
              alt="Jugador actual"
            >
            <div class="text-center">
              <div class="flex justify-between p-2 mt-4 font-bold bg-white rounded drop-shadow-lg">
                <div class="mr-4 text-left">
                  <p>Puntaje total:</p>
                  <p>Ronda:</p>
                </div>
                <div>
                  <p>{{ totalScore }}</p>
                  <p>{{ currentRound }}</p>
                </div>
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

    <div>
      <ButtonComponent
        v-if="!hasFinishedRound"
        buttonClass="mx-auto block my-3"
        :disabled="!inputScore"
        @onClick="nextTurn"
      >
        <p>Siguiente turno</p>
      </ButtonComponent>
      <!-- <ButtonComponent
        buttonClass="mx-auto block mt-3"
        :disabled="true"
      >
        <p>Saltar</p>
      </ButtonComponent> -->
      <ButtonComponent
        buttonClass="mx-auto block mt-3"
        @onClick="onPositionsModalChange(true)"
      >
        <p>Posiciones</p>
      </ButtonComponent>
    </div>

    <ModalComponent
      :showModal="showPositionsModal"
      @onCloseModal="onPositionsModalChange(false)"
    >
      <PositionsList ref="positionsList" />
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
      nextPlayerName: '',
      inputScore: '',
      totalScore: 0,
      currentRound: -1,
      displayPlayer: false,
      showPositionsModal: false,
      hasFinishedRound: false,
    });

    const positionsList = ref<InstanceType<typeof PositionsList> | null>(null);

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

    const linkPlayer = computed(() => `https://avatars.dicebear.com/api/bottts/${state.currentPlayer.name}.svg`);

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

    const onPositionsModalChange = (value: boolean): void => {
      state.showPositionsModal = value;
    };

    const continueNextRound = (): void => {
      state.hasFinishedRound = false;
      state.displayPlayer = false;

      setTimeout(() => {
        state.displayPlayer = true;
      }, 200);
    };

    return {
      ...toRefs(state),
      linkPlayer,
      positionsList,
      nextTurn,
      onPositionsModalChange,
      continueNextRound,
    };
  },
});
</script>
