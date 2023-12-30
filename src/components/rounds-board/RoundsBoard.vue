<template>
  <div
    v-if="isAbleToDisplay"
    class="py-3 font-bold"
  >
    <div
      v-for="round in copyOfRounds"
      :key="`round-${round.number}-${round.score}`"
    >
      <div class="flex justify-between p-4 pt-2 mx-auto mb-2 bg-gray-400 w-60 rounded-xl">
        <div>
          <p class="mt-2 text-white">Ronda {{ round.number }}</p>
        </div>
        <div class="flex items-center">
          <p class="pr-2 mt-2">Puntaje</p>
          <InputComponent
            v-model="round.newValue"
            inputClass="w-14 h-6"
            inputType="number"
            @change="debounceFunction(round)"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { useDebounceFn } from '@vueuse/core';
import {
  defineComponent,
  reactive,
  toRefs,
  computed,
} from 'vue';

import { NewRound, PlayerStore, Round } from '@/model/tables/player.model';
import InputComponent from '@/ui-components/input-component/InputComponent.vue';

export default defineComponent({
  name: 'RoundsBoard',
  components: {
    InputComponent,
  },
  props: {
    displayRoundsBoard: {
      type: Boolean,
      required: true,
    },
    selectedPlayerId: {
      type: String,
      required: true,
    },
    player: {
      type: Object as () => PlayerStore,
      required: true,
    },
  },
  setup(props, { emit }) {
    const state = reactive({
    });

    const isAbleToDisplay = computed((): boolean => props.displayRoundsBoard && props.selectedPlayerId === props.player.idPlayer);
    const copyOfRounds = computed((): NewRound[] => props.player.rounds
      .map((round: Round) => ({ ...round, newValue: `${round.score}` }))
      .sort((a: NewRound, b: NewRound) => b.number - a.number));

    const debounceFunction = useDebounceFn((round: NewRound) => {
      const score = parseInt(round.newValue, 10);

      if (score) {
        emit('update-round', {
          idPlayer: props.player.idPlayer,
          roundNumber: round.number,
          newScore: score,
        });
      }
    }, 1000);

    return {
      ...toRefs(state),
      isAbleToDisplay,
      copyOfRounds,
      debounceFunction,
      props,
    };
  },
});
</script>

<style lang='scss' scoped>
</style>
