<template>
  <div class="flex-1 m-3 mb-6 overflow-auto cs__players-list rounded-3xl p-7">
    <PlayerCard v-for="player in playerList"
                :key="player.name"
                :player="player.name"
    >
      {{ player.name }}
    </PlayerCard>

    <ModalComponent
      container-class="p-8 w-80"
      :showModal="showModal"
      @closeModal="closeModal"
    >
      <InputComponent v-model="currentPlayer">
        <template #label>
          <span class="font-bold">Nombre del jugador</span>
        </template>
      </InputComponent>

      <ButtonComponent
        class="mt-6 text-center"
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
import PlayerCard from '../player-card/PlayerCard.vue';

import { PlayerInformation } from './interface';

export default defineComponent({
  name: 'PlayersList',
  components: {
    ButtonComponent,
    InputComponent,
    ModalComponent,
    PlayerCard,
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
      currentPlayer: '',
      playerList: [] as Array<PlayerInformation>,
    });

    const closeModal = () => {
      state.currentPlayer = '';
      emit('closeModal', false);
    };

    const createPlayer = () => {
      if (state.currentPlayer === '') {
        return;
      }

      state.playerList.push({
        name: state.currentPlayer,
        position: state.playerList.length + 1,
      });

      closeModal();
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
  height: 350px;
  background-color: $green-base;
  @include shadow-pressed;
}
</style>
