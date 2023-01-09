<template>
  <div class="flex items-center mb-3 cs__player-name">
    <img
      :src="require('@/assets/icons/draggable.svg')"
      alt=""
      class="w-4 h-4 ml-2"
    >
    <p class="w-full px-3 py-3">
      {{ playerName }}
    </p>
    <button class="px-3" @pointerdown="onEdit">
      <img
        :src="require('@/assets/icons/edit.svg')"
        alt=""
        class="block h-5 w-7"
      >
    </button>
    <button class="px-3" @pointerdown="onDelete">
      <img
        :src="require('@/assets/icons/trash-can.svg')"
        alt=""
        class="block h-5 w-7"
      >
    </button>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'PlayerCard',
  props: {
    playerName: {
      type: String,
      required: true,
    },
    idPlayer: {
      type: String,
      required: true,
    },
  },
  setup(props, { emit }) {
    const onDelete = (): void => {
      emit('onDelete', props.idPlayer);
    };

    const onEdit = (): void => {
      emit('onEdit', props.idPlayer, props.playerName);
    };

    return {
      props,
      onDelete,
      onEdit,
    };
  },
});
</script>

<style lang='scss' scoped>
@import '@/assets/styles/variables';

.cs__player-name {
  border: 1px solid $contrast;
}
</style>
