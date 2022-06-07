<template>
  <div class="flex-1 m-3 mb-6 cs__players-list rounded-3xl">
    <ModalComponent
      container-class="p-6 w-80"
      :showModal="showModal"
      @closeModal="closeModal"
    >
      <InputComponent v-model="playerName">
        <template #label>
          <span class="font-bold">Nombre del jugador</span>
        </template>
      </InputComponent>

      <ButtonComponent
        class="mt-6 mb-4 text-center"
        @onClick="createPlayer"
      >
        <span>Añadir jugador</span>
      </ButtonComponent>
    </ModalComponent>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs } from 'vue';

import ButtonComponent from '../button-component/ButtonComponent.vue';
import InputComponent from '../input-component/InputComponent.vue';
import ModalComponent from '../modal-component/ModalComponent.vue';

export default defineComponent({
  name: 'PlayersList',
  components: {
    ButtonComponent,
    InputComponent,
    ModalComponent,
  },
  props: {
    showModal: {
      type: Boolean,
      default: true,
      required: true,
    },
  },
  setup(props, { emit }) {
    const state = reactive({
      playerName: '',
    });

    const createPlayer = () => {
      console.log(state.playerName);
    };

    const closeModal = () => {
      emit('closeModal', false);
    };

    return {
      ...toRefs(state),
      createPlayer,
      closeModal,
      props,
    };
  },
});
</script>

<style lang='scss'>
@import '@/assets/styles/variables';
@import '@/assets/styles/mixins';

.cs__players-list {
  background-color: $green-lighter;
  @include shadow-pressed;
}
</style>
