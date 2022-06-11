<template>
  <div class="flex-1 m-3 mb-6 overflow-auto cs__players-list rounded-3xl p-7">
    <draggable v-model="playerList" item-key="position">
      <template #item="{element}">
        <PlayerCard
          :playerName="element.name"
          :playerId="element.playerId"
          @onDelete="onDelete"
          @onEdit="onEdit"
        >
          {{ element.name }}
        </PlayerCard>
      </template>
    </draggable>

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
import draggable from 'vuedraggable';

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
    draggable,
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
      if (state.currentPlayer === '') return;

      const maxId = state.playerList.reduce((max, player) => (player.playerId > max ? player.playerId : max), 0);

      state.playerList.push({
        playerId: maxId + 1,
        name: state.currentPlayer,
      });

      onCloseModal();
    };

    const updatePlayer = () => {
      if (state.currentPlayer === '') return;

      state.playerList.find((player) => player.playerId === state.playerToEdit)!.name = state.currentPlayer;

      onCloseModal();
    };

    const onDelete = (playerId: number) => {
      state.playerList = state.playerList.filter((player) => player.playerId !== playerId);
    };

    const onEdit = (playerId: number, playerName: string) => {
      state.playerToEdit = playerId;
      state.currentPlayer = playerName;

      emit('onEdit');
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

<style lang='scss' scoped>
@import '@/assets/styles/variables';
@import '@/assets/styles/mixins';

.cs__players-list {
  height: 350px;
  background-color: $green-base;
  @include shadow-pressed;
}
</style>
