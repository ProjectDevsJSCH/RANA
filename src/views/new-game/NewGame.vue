<template>
  <div class="flex-1 flex flex-col">
    <div class="flex-1 cs__players-box m-3 mb-6 rounded-xl" />
    <div class="flex items-center justify-center flex-col pb-4">
      <ButtonComponent
        class="mb-4 text-center"
        @onClick="addPlayer"
      >
        <span>Añadir jugador</span>
      </ButtonComponent>

      <ButtonComponent
        class="text-center"
        @onClick="begin"
      >
        <span>Comenzar</span>
      </ButtonComponent>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import ButtonComponent from '@/components/button-component/ButtonComponent.vue';

export default defineComponent({
  name: 'NewGame',
  components: { ButtonComponent },
  setup() {
    const addPlayer = () => {
    };

    const begin = () => {
    };

    return { addPlayer, begin };
  },
});
</script>

<style lang='scss'>
@import '@/assets/styles/variables';

.cs__players-box {
  border: 2px solid $green-darker;
  background-color: $gray-light;
}
</style>
