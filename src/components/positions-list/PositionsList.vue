<template>
  <div
    v-if="props.showPositions"
    id="positionsList"
    class="absolute top-0 left-0 z-10 w-full max-h-screen cs__positions-list py-14"
  >
    <div class="mx-auto overflow-x-auto rounded-lg w-80">
      <table
        ref="content"
        class="mx-auto bg-white rounded-lg shadow-lg"
      >
        <tr>
          <th class="px-4 py-2 text-left">Jugador</th>
          <td
            v-for="(player) in totalPlayers"
            :key="player.idPlayer"
            class="px-4 py-2 font-bold border"
          >
            {{ player.name }}
          </td>
        </tr>
        <tr v-for="round in [...Array(currentRound).keys()]" :key="round">
          <th class="px-4 py-2 text-left">Ronda {{ round + 1 }}</th>
          <td
            v-for="(player) in totalPlayers"
            :key="player.idPlayer"
            class="px-4 py-2 border"
          >
            {{ player.rounds[round]?.score || 0 }}
          </td>
        </tr>
        <tr>
          <th class="px-4 py-2 text-left bg-green-100">Total</th>
          <td
            v-for="(player) in totalPlayers"
            :key="player.idPlayer"
            class="px-4 py-2 font-bold bg-green-100 border"
          >
            {{ player.totalScore }}
          </td>
        </tr>
        <tr>
          <th class="px-4 py-2 text-left">Pos.</th>
          <td
            v-for="position in playersScorePosition"
            :key="position"
            class="px-4 py-2 font-bold border"
          >
            {{ position }}
          </td>
        </tr>
      </table>
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
      playersScorePosition: [] as Array<number>,
    });

    const updatePositionsList = async (): Promise<void> => {
      try {
        state.totalPlayers = await PlayerApi.getAllPlayers();
        state.currentRound = await GameApi.getCurrentRound();

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

    const content = ref(null);

    onClickOutside(content, () => emit('onClosePositions'));

    return {
      ...toRefs(state),
      props,
      updatePositionsList,
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
