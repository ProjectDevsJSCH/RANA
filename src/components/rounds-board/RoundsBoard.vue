<template>
  <div v-if="isAbleToDisplay">
    Rondas
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  reactive,
  toRefs,
  computed,
} from 'vue';

export default defineComponent({
  name: 'RoundsBoard',
  props: {
    displayRoundsBoard: {
      type: Boolean,
      required: true,
    },
    selectedPlayerId: {
      type: String,
      required: true,
    },
    playerId: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const state = reactive({
    });

    const isAbleToDisplay = computed((): boolean => props.displayRoundsBoard && props.selectedPlayerId === props.playerId);

    return {
      ...toRefs(state),
      isAbleToDisplay,
      props,
    };
  },
});
</script>

<style lang='scss' scoped>
</style>
