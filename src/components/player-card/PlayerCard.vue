<template>
  <div class="flex items-center p-2 mb-3 cs__player-name">
    <p class="w-full">
      {{ playerName }}
    </p>
    <button class="mr-3" @click="onEdit">
      <img :src="require('@/assets/icons/edit.svg')"
           alt=""
      >
    </button>
    <button @click="onDelete">
      <img
        :src="require('@/assets/icons/trash-can.svg')"
        alt=""
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
    playerId: {
      type: Number,
      required: true,
    },
  },
  setup(props, { emit }) {
    const onDelete = () => {
      emit('onDelete', props.playerId);
    };

    const onEdit = () => {
      emit('onEdit', props.playerId, props.playerName);
    };

    return {
      props,
      onDelete,
      onEdit,
    };
  },
});
</script>

<style lang='scss'>
@import '@/assets/styles/variables';

.cs__player-name {
  border: 4px solid white;
}
</style>
