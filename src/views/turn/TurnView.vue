<template>
  <div class="flex flex-col items-center justify-around flex-1">
    <transition name="show">
      <div
        v-if="displayPlayer"
        class="mt-10"
      >
        <div class="text-center">
          <p class="text-2xl">Turno de</p>
          <p class="overflow-hidden text-4xl font-bold w-96 text-ellipsis">{{ currentPlayer.name }}</p>
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
      </div>
    </transition>

    <div>
      <InputComponent
        v-model="inputScore"
        placeholder="0"
        class="w-80"
        :inputType="'number'"
      >
        <template #label>
          <span class="font-bold">Puntaje</span>
        </template>
      </InputComponent>
    </div>

    <div>
      <ButtonComponent
        buttonClass="mx-auto block mt-3"
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
      >
        <p>Posiciones</p>
      </ButtonComponent>
    </div>
  </div>
</template>

<script lang="ts">
import {
  defineComponent, onBeforeMount, reactive, toRefs, computed,
} from 'vue';

import { GameApi } from '@/api/game.api';
import { PlayerApi } from '@/api/player.api';
import { PlayerStore } from '@/model/tables/player.model';
import ButtonComponent from '@/ui-components/button-component/ButtonComponent.vue';
import InputComponent from '@/ui-components/input-component/InputComponent.vue';

export default defineComponent({
  components: {
    InputComponent,
    ButtonComponent,
  },
  setup() {
    const state = reactive({
      currentPlayer: {} as PlayerStore,
      inputScore: '',
      totalScore: 0,
      currentRound: -1,
      displayPlayer: false,
    });

    onBeforeMount(async () => {
      try {
        state.currentPlayer = await GameApi.getCurrentPlayer();
        state.currentRound = await GameApi.getCurrentRound();
        state.totalScore = state.currentPlayer.totalScore;
      } catch (error) {
        console.error(error);
      }

      setTimeout(() => {
        state.displayPlayer = true;
      }, 200);
    });

    const linkPlayer = computed(() => `https://avatars.dicebear.com/api/bottts/${state.currentPlayer.name}.svg`);

    const nextTurn = async (): Promise<void> => {
      try {
        state.currentPlayer = await GameApi.setNextTurn(+state.inputScore);
        state.currentRound = await GameApi.getCurrentRound();
        state.totalScore = state.currentPlayer.totalScore;
        state.inputScore = '';
      } catch (error) {
        console.error(error);
      }
    };

    return {
      ...toRefs(state),
      linkPlayer,
      nextTurn,
    };
  },
});
</script>
