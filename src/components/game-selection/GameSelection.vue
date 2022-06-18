<template>
  <ModalComponent
    :showModal="showModal"
    containerClass="p-8 w-80"
    @onCloseModal="onCloseModal"
  >
    <InputComponent
      v-model="value"
      placeholder="0"
      :inputType="'number'"
    >
      <template #label>
        <span class="font-bold">
          {{ secondLabel }}
        </span>
      </template>
    </InputComponent>
  </ModalComponent>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs } from 'vue';

import { GAMES } from '@/db/enums/games.enum';
import InputComponent from '@/ui-components/input-component/InputComponent.vue';
import ModalComponent from '@/ui-components/modal-component/ModalComponent.vue';

export default defineComponent({
  components: {
    ModalComponent,
    InputComponent,
  },
  name: 'GameSelection',
  props: {
    showModal: {
      type: Boolean,
      default: false,
      required: true,
    },
  },
  setup(props, { emit }) {
    const state = reactive({
      value: '',
      secondLabel: GAMES.SCORE_LIMIT,
    });

    const onCloseModal = () => {
      emit('onCloseModal');
    };

    return {
      ...toRefs(state),
      onCloseModal,
      props,
    };
  },
});
</script>

<style lang='scss' scoped>
</style>
