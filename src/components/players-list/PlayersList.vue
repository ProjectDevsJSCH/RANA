<template>
  <div class="flex-1 m-3 mb-6 overflow-auto cs__players-list rounded-3xl p-7">
    <PlayerCard v-for="player in playerList"
                :key="player.name"
                :playerName="player.name"
                :playerId="player.playerId"
                @onDelete="onDelete"
                @onEdit="onEdit"
    >
      {{ player.name }}
    </PlayerCard>

    <ModalComponent
      container-class="p-8 w-80"
      :showModal="showModal"
      @onCloseModal="onCloseModal"
    >
      <InputComponent v-model="currentPlayer">
        <template #label>
          <span class="font-bold">Nombre del jugador</span>
        </template>
      </InputComponent>

      <ButtonComponent
        v-if="mode === 'create'"
        class="mt-6 text-center"
        @onClick="createPlayer"
      >
        <span>Añadir jugador</span>
      </ButtonComponent>
      <ButtonComponent
        v-else
        class="mt-6 text-center"
        @onClick="updatePlayer"
      >
        <span>Editar jugador</span>
      </ButtonComponent>
    </ModalComponent>
  </div>
</template>

<script lang="ts">
import {
  defineComponent, PropType, reactive, toRefs,
} from 'vue';

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
      default: false,
      required: true,
    },
    mode: {
      type: String as PropType<'create' | 'edit'>,
      default: 'create',
      required: true,
    },
  },
  setup(props, { emit }) {
    const state = reactive({
      currentPlayer: '',
      playerList: [] as Array<PlayerInformation>,
      playerToEdit: -1,
    });

    const onCloseModal = () => {
      state.currentPlayer = '';

      emit('onModalChange', false);
    };

    const createPlayer = () => {
      if (state.currentPlayer === '') {
        return;
      }

      state.playerList.push({
        playerId: state.playerList.length + 1,
        name: state.currentPlayer,
        position: state.playerList.length + 1,
      });

      onCloseModal();
    };

    const updatePlayer = () => {
      if (state.currentPlayer === '') {
        return;
      }

      state.playerList.find((player) => player.playerId === state.playerToEdit)!.name = state.currentPlayer;

      onCloseModal();
    };

    const onDelete = (playerId: number) => {
      state.playerList = state.playerList.filter((player) => player.playerId !== playerId);
    };

    const onEdit = (playerId: number, playerName: string, mode: 'create' | 'edit') => {
      state.playerToEdit = playerId;
      state.currentPlayer = playerName;

      emit('onEdit', true, mode);
    };

    return {
      ...toRefs(state),
      createPlayer,
      updatePlayer,
      onCloseModal,
      onDelete,
      onEdit,
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
