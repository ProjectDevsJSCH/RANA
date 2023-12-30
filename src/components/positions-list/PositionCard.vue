<template>
  <div>
    <div class="flex items-center font-bold">
      <p class="mr-4">{{ props.index + 1 }}.</p>
      <img
        class="p-1 mr-4 bg-white rounded-full w-14 h-14"
        :src="getLinkPlayer(props.player)"
        alt="Jugador actual"
      >
      <div class="flex items-end justify-between flex-1">
        <div>
          <p>{{ props.player.name }}</p>
          <p class="text-gray-500">{{ props.player.totalScore }}</p>
        </div>
        <div class="ml-3">
          <p
            class="text-blue-500 cursor-pointer"
            @click="openRoundsBoard(props.player.idPlayer)"
            @keydown="openRoundsBoard(props.player.idPlayer)"
          >
            Rondas
            <i class="!border-blue-500 arrow arrow--down" />
          </p>
        </div>
      </div>
    </div>
    <transition name="dropdown">
      <RoundsBoard
        :displayRoundsBoard="displayRoundsBoard"
        :selectedPlayerId="selectedPlayerId"
        :player="player"
        @update-round="onUpdateRound"
      />
    </transition>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  reactive,
  toRefs,
} from 'vue';

import { PlayerApi } from '@/api/player.api';
import RoundsBoard from '@/components/rounds-board/RoundsBoard.vue';
import { PlayerStore } from '@/model/tables/player.model';

export default defineComponent({
  name: 'PositionCard',
  components: {
    RoundsBoard,
  },
  props: {
    player: {
      type: Object as () => PlayerStore,
      required: true,
    },
    index: {
      type: Number,
      required: true,
    },
  },
  setup(props, { emit }) {
    const state = reactive({
      displayRoundsBoard: false,
      selectedPlayerId: '',
    });
    const getLinkPlayer = (
      player: PlayerStore,
    ): string => `https://api.dicebear.com/7.x/thumbs/svg?backgroundType=gradientLinear&seed=${player.name}`;

    const openRoundsBoard = (playerId: string): void => {
      state.displayRoundsBoard = !state.displayRoundsBoard;
      state.selectedPlayerId = playerId;
    };

    const onUpdateRound = async (round: {
      idPlayer: string,
      roundNumber: number,
      newScore: number,
    }): Promise<void> => {
      await PlayerApi.updatePlayerRoundScore(round.idPlayer, round.roundNumber, round.newScore);

      await emit('update-player-score');
    };

    return {
      ...toRefs(state),
      getLinkPlayer,
      openRoundsBoard,
      onUpdateRound,
      props,
    };
  },
});
</script>

<style lang='scss' scoped>
</style>
