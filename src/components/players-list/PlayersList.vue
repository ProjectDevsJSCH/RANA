<template>
  <div class="flex-1 m-3 mb-6 overflow-auto cs__players-list rounded-3xl p-7">
    <draggable v-model="playerList" item-key="position">
      <template #item="{ element }">
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
      containerClass="p-8 w-80"
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
        class="block mx-auto mt-6 text-center"
        :disabled="disabled"
        @onClick="createPlayer"
      >
        <span>Añadir jugador</span>
      </ButtonComponent>
      <ButtonComponent
        v-else
        class="block mx-auto mt-6 text-center"
        :disabled="disabled"
        @onClick="updatePlayer"
      >
        <span>Editar jugador</span>
      </ButtonComponent>
    </ModalComponent>
  </div>
</template>

<script lang="ts">
import _ from 'lodash';
import {
  computed,
  defineComponent,
  PropType,
  reactive,
  toRefs,
  watch,
} from 'vue';
import draggable from 'vuedraggable';

import ButtonComponent from '@/ui-components/button-component/ButtonComponent.vue';
import InputComponent from '@/ui-components/input-component/InputComponent.vue';
import ModalComponent from '@/ui-components/modal-component/ModalComponent.vue';

import PlayerCard from '../player-card/PlayerCard.vue';

import { PlayerInformation } from './interface';

export default defineComponent({
  name: 'PlayersList',
  components: {
    PlayerCard,
    draggable,
    ModalComponent,
    ButtonComponent,
    InputComponent,
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

    const disabled = computed(() => state.currentPlayer === '');

    const onCloseModal = (): void => {
      state.currentPlayer = '';

      emit('onModalChange', false);
    };

    const createPlayer = (): void => {
      if (state.currentPlayer === '') return;

      const maxId = state.playerList
        .reduce((max, player) => (player.playerId > max ? player.playerId : max), 0);

      state.playerList.push({
        playerId: maxId + 1,
        name: state.currentPlayer,
      });

      onCloseModal();
    };

    const updatePlayer = (): void => {
      if (state.currentPlayer === '') return;

      state.playerList.find((player) => player.playerId === state.playerToEdit)!.name = state.currentPlayer;

      onCloseModal();
    };

    const onDelete = (playerId: number): void => {
      state.playerList = state.playerList.filter((player) => player.playerId !== playerId);
    };

    const onEdit = (playerId: number, playerName: string): void => {
      state.playerToEdit = playerId;
      state.currentPlayer = playerName;

      emit('onEdit');
    };

    watch(() => _.cloneDeep(state.playerList), (newValue): void => {
      emit('onPlayerListChange', newValue);
    });

    return {
      ...toRefs(state),
      createPlayer,
      updatePlayer,
      onCloseModal,
      onDelete,
      onEdit,
      disabled,
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
  border: 1px solid $erie-black-light;
}
</style>
