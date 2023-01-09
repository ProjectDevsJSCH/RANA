<template>
  <div class="p-4 overflow-x-scroll overflow-y-auto text-center w-80">
    <table>
      <tr>
        <th class="px-4 py-2 text-left">Pos.</th>
        <td
          v-for="(player, index) in totalPlayers"
          :key="player.idPlayer"
          class="px-4 py-2 font-bold border"
        >
          {{ index + 1 }}
        </td>
      </tr>
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
        <th class="px-4 py-2 text-left">Ronda({{ round + 1 }})</th>
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
    </table>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  reactive,
  toRefs,
  onBeforeMount,
} from 'vue';

import { GameApi } from '@/api/game.api';
import { PlayerApi } from '@/api/player.api';
import { PlayerStore } from '@/model/tables/player.model';

export default defineComponent({
  name: 'PositionsList',
  components: {

  },
  setup() {
    const state = reactive({
      totalPlayers: [] as Array<PlayerStore>,
      currentRound: 0,
    });

    onBeforeMount(async () => {
      try {
        state.totalPlayers = await PlayerApi.getAllSortedPlayers();
        state.currentRound = await GameApi.getCurrentRound();
      } catch (error) {
        console.error(error);
      }
    });

    return {
      ...toRefs(state),
    };
  },
});
</script>

<style lang='scss' scoped>
</style>
