<template>
  <div class="flex flex-col flex-1">
    <PlayersList
      :showModal="showPlayerModal"
      :mode="mode"
      @onModalChange="onModalChange"
      @onEdit="onEdit"
    />
    <div class="flex flex-col items-center justify-center pb-4">
      <ButtonComponent
        class="mb-4 text-center"
        @onClick="addPlayer"
      >
        <span>Añadir jugador</span>
      </ButtonComponent>

      <ButtonComponent
        class="text-center"
        @onClick="begin"
      >
        <span>Comenzar</span>
      </ButtonComponent>
    </div>

    <GameSelection
      :showModal="showGameModal"
      @onCloseModal="onCloseGameModal"
      @onSubmit="onSubmit"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs } from 'vue';

import { GameApi } from '@/api/game.api';
import GameSelection from '@/components/game-selection/GameSelection.vue';
import PlayersList from '@/components/players-list/PlayersList.vue';
import { GAMES } from '@/db/enums/games.enum';
import ButtonComponent from '@/ui-components/button-component/ButtonComponent.vue';

export default defineComponent({
  name: 'NewGame',
  components: {
    ButtonComponent,
    PlayersList,
    GameSelection,
  },
  setup() {
    const state = reactive({
      showPlayerModal: false,
      showGameModal: false,
      playerName: '',
      mode: 'create' as 'create' | 'edit',
    });

    const addPlayer = () => {
      state.showPlayerModal = true;
      state.mode = 'create';
    };

    const begin = () => {
      state.showGameModal = true;
    };

    const onModalChange = (showModal: boolean) => {
      state.showPlayerModal = showModal;
    };

    const onEdit = () => {
      state.showPlayerModal = true;
      state.mode = 'edit';
    };

    const onCloseGameModal = () => {
      state.showGameModal = false;
    };

    const onSubmit = (selectedOption: GAMES, value: string) => {
      GameApi.setNewGame(selectedOption, value);
    };

    return {
      ...toRefs(state),
      addPlayer,
      begin,
      onModalChange,
      onEdit,
      onCloseGameModal,
      onSubmit,
    };
  },
});
</script>
