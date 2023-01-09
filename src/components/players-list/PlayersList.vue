<template>
  <div class="flex-1 m-3 mb-6 overflow-auto cs__players-list rounded-3xl p-7">
    <draggable v-model="playerList" item-key="position">
      <template #item="{ element }">
        <PlayerCard
          :playerName="element.name"
          :idPlayer="element.idPlayer"
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
      <InputComponent v-model="currentPlayerName">
        <template #label>
          <span class="font-bold">Nombre</span>
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
import _, { uniqueId } from 'lodash';
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

import { PlayerInformation } from './player-information.interface';

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
      currentPlayerName: '',
      playerList: [] as Array<PlayerInformation>,
      idPlayerToEdit: '',
    });

    const disabled = computed(() => state.currentPlayerName === '');

    const onCloseModal = (): void => {
      emit('onModalChange', false);
    };

    const createPlayer = (): void => {
      if (state.currentPlayerName === '') return;

      state.playerList.push({
        idPlayer: uniqueId(),
        name: state.currentPlayerName,
        position: state.playerList.length + 1,
      });

      onCloseModal();
    };

    const updatePlayer = (): void => {
      if (state.currentPlayerName === '') return;

      state.playerList.find((player) => player.idPlayer === state.idPlayerToEdit)!.name = state.currentPlayerName;

      onCloseModal();
    };

    const onDelete = (idPlayer: string): void => {
      state.playerList = state.playerList.filter((player) => player.idPlayer !== idPlayer);
    };

    const onEdit = (idPlayer: string, playerName: string): void => {
      state.idPlayerToEdit = idPlayer;
      state.currentPlayerName = playerName;

      emit('onEdit');
    };

    watch(() => _.cloneDeep(state.playerList), (newValue): void => {
      // reset positions before sending to parent
      state.playerList.forEach((player, index) => {
        player.position = index + 1;
      });

      emit('onPlayerListChange', newValue);
    });

    watch(() => props.showModal, (newValue): void => {
      if (newValue && props.mode === 'create') {
        state.currentPlayerName = '';
        state.idPlayerToEdit = '';
      }
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
  border: 1px solid $shadow;
  background-color: $base;
}
</style>
