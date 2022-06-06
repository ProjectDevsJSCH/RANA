<template>
  <div class="flex-1 flex flex-col">
    <div class="flex-1 cs__players-box m-3 mb-6" />
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

    <ModalComponent
      container-class="p-6 w-80"
      :showModal="showModal"
      @closeModal="showModal = false"
    >
      <InputComponent v-model="playerName">
        <template #label>
          <span class="font-bold">Nombre del jugador</span>
        </template>
      </InputComponent>

      <ButtonComponent
        class="mb-4 text-center mt-6"
        @onClick="createPlayer"
      >
        <span>Añadir jugador</span>
      </ButtonComponent>
    </ModalComponent>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs } from 'vue';

import ButtonComponent from '@/components/button-component/ButtonComponent.vue';
import InputComponent from '@/components/input-component/InputComponent.vue';
import ModalComponent from '@/components/modal-component/ModalComponent.vue';

export default defineComponent({
  name: 'NewGame',
  components: { ButtonComponent, ModalComponent, InputComponent },
  setup() {
    const state = reactive({
      showModal: false,
      playerName: '',
    });

    const addPlayer = () => {
      state.showModal = true;
    };

    const begin = () => {
      state.showModal = true;
    };

    const createPlayer = () => {
      console.log(state.playerName);
    };

    return {
      addPlayer, begin, createPlayer, ...toRefs(state),
    };
  },
});
</script>

<style lang='scss'>
@import '@/assets/styles/variables';

.cs__players-box {
  background-color: $gray-light;
}
</style>
