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
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  reactive,
  toRefs,
  computed,
} from 'vue';

import { PlayerStore, Round } from '@/model/tables/player.model';
import InputComponent from '@/ui-components/input-component/InputComponent.vue';

interface NewRound extends Round {
  newValue: string;
}

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
  setup(props) {
    const state = reactive({
    });

    const isAbleToDisplay = computed((): boolean => props.displayRoundsBoard && props.selectedPlayerId === props.player.idPlayer);
    const copyOfRounds = computed((): NewRound[] => props.player.rounds
      .map((round: Round) => ({ ...round, newValue: `${round.score}` }))
      .sort((a: NewRound, b: NewRound) => b.number - a.number));

    return {
      ...toRefs(state),
      isAbleToDisplay,
      copyOfRounds,
      props,
    };
  },
});
</script>

<style lang='scss' scoped>
</style>
