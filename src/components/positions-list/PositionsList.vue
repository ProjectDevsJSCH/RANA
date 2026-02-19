<template>
  <div
    v-if="props.showPositions"
    class="absolute top-0 left-0 z-10 flex w-full h-screen px-8 pb-24 cs__positions-list py-14"
  >
    <div class="relative flex flex-1 py-5 mx-auto cs__positions-container rounded-2xl">
      <button
        class="cs__close-button"
        aria-label="Cerrar posiciones"
        @click="$emit('onClosePositions')"
      >
        ✕
      </button>
      <div
        ref="content"
        class="flex-1 overflow-y-auto"
      >
        <div v-if="isLoading" class="flex items-center justify-center py-8">
          <div class="cs__spinner" />
        </div>
        <div
          v-for="(player, index) in sortedPlayers"
          :key="player.idPlayer"
          class="w-[90%] px-4 py-2 mx-auto mb-3 rounded-xl transition-colors duration-200"
          :class="{
            'cs__position-card--active': player.idPlayer === currentPlayer.idPlayer,
            'cs__position-card': player.idPlayer !== currentPlayer.idPlayer,
          }"
        >
          <PositionCard
            :player="player"
            :index="index"
            @update-player-score="updatePositionsList"
          />
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

import PositionCard from './PositionCard.vue';

export default defineComponent({
  name: 'PositionsList',
  components: {
    PositionCard,
  },
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
      displayRoundsBoard: false,
      selectedPlayerId: '-1',
      isLoading: false,
    });
    const content = ref(null);

    onClickOutside(content, () => emit('onClosePositions'));

    const updatePositionsList = async (): Promise<void> => {
      state.isLoading = true;

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
        console.error('Error loading positions:', error);
      } finally {
        state.isLoading = false;
      }
    };

    onBeforeMount(async () => {
      await updatePositionsList();
    });

    const sortedPlayers = computed(() => [...state.totalPlayers].sort((a, b) => b.totalScore - a.totalScore));

    return {
      ...toRefs(state),
      props,
      sortedPlayers,
      updatePositionsList,
      content,
    };
  },
});
</script>

<style lang='scss' scoped>
@import '@/assets/styles/variables';

.cs__positions-list {
  backdrop-filter: blur(10px);
  background-color: rgba($dark, 0.3);
}

.cs__positions-container {
  background: white;
  box-shadow: $shadow-strong;
}

.cs__position-card {
  background-color: #f3f4f6;

  &--active {
    background-color: $accent-light;
    border: 1.5px solid $accent;
  }
}

.cs__close-button {
  position: absolute;
  top: -10px;
  right: -10px;
  cursor: pointer;
  text-align: center;
  background: white;
  border: 2px solid $dark;
  border-radius: 50%;
  font-size: 12px;
  font-weight: bold;
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: $shadow-soft;
  transition: transform 0.2s ease;

  &:hover {
    transform: scale(1.1);
  }
}

.cs__spinner {
  width: 28px;
  height: 28px;
  border: 3px solid $shadow;
  border-top-color: $accent;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>
