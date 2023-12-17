<template>
  <div
    v-if="props.showPositions"
    class="absolute top-0 left-0 z-10 flex w-full h-screen px-8 pb-24 cs__positions-list py-14"
  >
    <div class="relative flex flex-1 py-5 mx-auto bg-white rounded-lg">
      <div class="cs__close-button">X</div>
      <div
        ref="content"
        class="flex-1 overflow-y-auto"
      >
        <div
          v-for="(player, index) in sortedPlayers"
          :key="player.idPlayer"
          class="w-[90%] px-4 py-2 mx-auto mb-3 bg-gray-200 rounded-xl"
          :class="{
            'bg-green-200': player.idPlayer === currentPlayer.idPlayer,
          }"
        >
          <div class="flex items-center font-bold">
            <p class="mr-4">{{ index + 1 }}.</p>
            <img
              class="p-1 mr-4 bg-white rounded-full w-14 h-14"
              :src="getLinkPlayer(player)"
              alt="Jugador actual"
            >
            <div>
              <p>{{ player.name }}</p>
              <p class="text-gray-500">{{ player.totalScore }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { onClickOutside } from '@vueuse/core';
import {
  defineComponent,
  reactive,
  toRefs,
  onBeforeMount,
  ref,
  computed,
} from 'vue';

import { GameApi } from '@/api/game.api';
import { PlayerApi } from '@/api/player.api';
import { PlayerStore } from '@/model/tables/player.model';

export default defineComponent({
  name: 'PositionsList',
  props: {
    showPositions: {
      type: Boolean,
      required: true,
    },
  },
  setup(props, { emit }) {
    const state = reactive({
      totalPlayers: [] as Array<PlayerStore>,
      currentRound: 0,
      currentPlayer: {} as PlayerStore,
      playersScorePosition: [] as Array<number>,
    });

    const updatePositionsList = async (): Promise<void> => {
      try {
        state.totalPlayers = await PlayerApi.getAllPlayers();
        state.currentRound = await GameApi.getCurrentRound();
        state.currentPlayer = await GameApi.getCurrentPlayer();

        const playersScores = [...state.totalPlayers]
          .sort((a, b) => b.totalScore - a.totalScore)
          .map((player, index) => ({ player: player.idPlayer, positionScore: index + 1 }));

        state.playersScorePosition = [...state.totalPlayers]
          .map((player) => playersScores.find((score) => score.player === player.idPlayer)?.positionScore || 0);
      } catch (error) {
        console.error(error);
      }
    };

    onBeforeMount(async () => {
      await updatePositionsList();
    });

    const sortedPlayers = computed(() => [...state.totalPlayers].sort((a, b) => b.totalScore - a.totalScore));

    const getLinkPlayer = (
      player: PlayerStore,
    ): string => `https://api.dicebear.com/7.x/thumbs/svg?backgroundType=gradientLinear&seed=${player.name}`;

    const content = ref(null);

    onClickOutside(content, () => emit('onClosePositions'));

    return {
      ...toRefs(state),
      props,
      sortedPlayers,
      updatePositionsList,
      getLinkPlayer,
      content,
    };
  },
});
</script>

<style lang='scss' scoped>
@import '@/assets/styles/variables';

table > tr > td {
  text-align: center;
  min-width: 100px;
  border-right: 1px solid #b4bbbb;
}

table > tr > th {
  min-width: 100px;
  border-right: 1px solid #b4bbbb;
  border-bottom: 1px solid #b4bbbb;
}

.cs__positions-list {
  backdrop-filter: blur(10px);
}
</style>
