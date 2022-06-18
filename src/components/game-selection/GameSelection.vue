<template>
  <ModalComponent
    :showModal="showModal"
  />
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs } from 'vue';

import ModalComponent from '@/ui-components/modal-component/ModalComponent.vue';

export default defineComponent({
  components: { ModalComponent },
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
