<template>
  <div class="cs__home flex-1 flex items-center justify-center">
    <div>
      <ButtonComponent
        class="mb-4 text-center"
      >
        <span>Juego nuevo</span>
      </ButtonComponent>

      <ButtonComponent
        class="text-center"
      >
        <span>Continuar juego</span>
      </ButtonComponent>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import ButtonComponent from '@/components/button-component/ButtonComponent.vue';

export default defineComponent({
  name: 'HomeView',
  components: { ButtonComponent },
});
</script>
<style lang="scss" scoped >
.cs__home {

}
</style>
