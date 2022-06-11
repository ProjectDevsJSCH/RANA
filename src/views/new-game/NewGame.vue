<template>
  <div class="flex flex-col flex-1">
    <PlayersList :showModal="showModal"
                 :mode="mode"
                 @onModalChange="onModalChange"
                 @onEdit="onEdit"
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
      mode: 'create' as 'create' | 'edit',
    });

    const addPlayer = () => {
      state.showModal = true;
      state.mode = 'create';
    };

    const begin = () => {
      state.showModal = true;
    };

    const onModalChange = (showModal: boolean) => {
      state.showModal = showModal;
    };

    const onEdit = () => {
      state.showModal = true;
      state.mode = 'edit';
    };

    return {
      addPlayer,
      begin,
      onModalChange,
      onEdit,
      ...toRefs(state),
    };
  },
});
</script>
