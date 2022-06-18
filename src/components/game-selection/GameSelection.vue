<template>
  <ModalComponent :showModal="showModal">
    <InputComponent v-model="value">
      <template #label>
        <span class="font-bold">
          Nombre del jugador
        </span>
      </template>
    </InputComponent>
  </ModalComponent>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs } from 'vue';

import InputComponent from '@/ui-components/input-component/InputComponent.vue';
import ModalComponent from '@/ui-components/modal-component/ModalComponent.vue';

export default defineComponent({
  components: {
    ModalComponent,
    InputComponent,
  },
  name: 'GameSelection',
  setup() {
    const state = reactive({
      showModal: false,
    });
    return {
      ...toRefs(state),
    };
  },
});
</script>

<style lang='scss' scoped>
</style>
