<template>
  <div class="flex flex-col flex-1">
    <PlayersList :showModal="showModal"
                 @closeModal="showModal = $event"
    />
    <div class="flex flex-col items-center justify-center pb-4">
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
import { defineComponent, reactive, toRefs } from 'vue';

import ButtonComponent from '@/components/button-component/ButtonComponent.vue';
import PlayersList from '@/components/players-list/PlayersList.vue';

export default defineComponent({
  name: 'NewGame',
  components: {
    ButtonComponent, PlayersList,
  },
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

    return {
      addPlayer,
      begin,
      ...toRefs(state),
    };
  },
});
</script>
