<template>
  <div class="flex items-center p-2 mb-3 cs__player-name">
    <p class="w-full">
      {{ player }}
    </p>
    <img class="mr-3"
         :src="require('@/assets/icons/edit.svg')"
         alt=""
    >
    <img
      :src="require('@/assets/icons/trash-can.svg')"
      alt=""
    >
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'PlayerCard',
  props: {
    player: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    return {
      props,
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
