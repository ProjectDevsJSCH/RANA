<template>
  <div class="flex flex-col flex-1">
    <PlayersList
      :showModal="showPlayerModal"
      :mode="mode"
      @onModalChange="onModalChange"
      @onEdit="onEdit"
      @onPlayerListChange="onPlayerListChange"
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
import { useRouter } from 'vue-router';

import { GameApi } from '@/api/game.api';
import { PlayerApi } from '@/api/player.api';
import GameSelection from '@/components/game-selection/GameSelection.vue';
import PlayersList from '@/components/players-list/PlayersList.vue';
import { PlayerInformation } from '@/components/players-list/interface';
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
    const router = useRouter();

    const state = reactive({
      showPlayerModal: false,
      showGameModal: false,
      playerName: '',
      mode: 'create' as 'create' | 'edit',
      playerList: [] as Array<PlayerInformation>,
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

    const onPlayerListChange = (playerList: Array<PlayerInformation>) => {
      state.playerList = playerList;
    };

    const onSubmit = async (selectedOption: GAMES, value: string) => {
      try {
        await GameApi.setNewGame(selectedOption, value);
        await PlayerApi.addPlayers(state.playerList);
      } catch (error) {
        return;
      }

      state.showGameModal = false;
      router.push({ name: 'CurrentTurn' });
    };

    return {
      ...toRefs(state),
      addPlayer,
      begin,
      onModalChange,
      onEdit,
      onCloseGameModal,
      onSubmit,
      onPlayerListChange,
    };
  },
});
</script>
