<template>
  <div class="flex flex-col items-center justify-around flex-1">
    <transition name="show">
      <div
        v-if="displayPlayer"
        class="flex items-center justify-center mt-10"
      >
        <img
          class="w-40 h-40 p-2 mr-5 bg-black rounded-full"
          :src="linkPlayer"
          alt="Jugador actual"
        >

        <div class="text-center">
          <p class="text-2xl">Turno de</p>
          <p class="text-4xl font-bold">{{ currentPlayer.name }}</p>
        </div>
      </div>
    </transition>

    <InputComponent
      v-model="score"
      placeholder="0"
      class="w-80"
      :inputType="'number'"
    >
      <template #label>
        <span class="font-bold">Puntaje</span>
      </template>
    </InputComponent>

    <div class="mt-6">
      <ButtonComponent
        buttonClass="mx-auto block mt-3"
        :disabled="!score"
        @onClick="nextTurn"
      >
        <p>Siguiente turno</p>
      </ButtonComponent>
      <ButtonComponent
        buttonClass="mx-auto block mt-3"
      >
        <p>Saltar</p>
      </ButtonComponent>
      <ButtonComponent
        buttonClass="mx-auto block mt-3"
      >
        <p>Editar posiciones</p>
      </ButtonComponent>
    </div>
  </div>
</template>

<script lang="ts">
import {
  defineComponent, onBeforeMount, reactive, toRefs, computed,
} from 'vue';

import { GameApi } from '@/api/game.api';
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
      score: '',
      displayPlayer: false,
    });

    onBeforeMount(async () => {
      try {
        state.currentPlayer = await GameApi.getCurrentPlayer();
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
        state.currentPlayer = await GameApi.setNextTurn(+state.score);
        state.score = '';
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
