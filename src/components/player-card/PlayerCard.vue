<template>
  <div class="flex items-center mb-3 cs__player-name">
    <img
      :src="require('@/assets/icons/draggable.svg')"
      alt="Arrastrar"
      class="w-4 h-4 ml-2"
    >
    <p class="w-full px-3 py-3 overflow-hidden text-ellipsis">
      {{ playerName }}
    </p>
    <button
      class="px-3 cs__player-name__action"
      aria-label="Editar jugador"
      @pointerdown="onEdit"
    >
      <img
        :src="require('@/assets/icons/edit.svg')"
        alt="Editar"
        class="block h-5 w-7"
      >
    </button>
    <button
      class="px-3 cs__player-name__action"
      aria-label="Eliminar jugador"
      @pointerdown="onDelete"
    >
      <img
        :src="require('@/assets/icons/trash-can.svg')"
        alt="Eliminar"
        class="block h-5 w-7"
      >
    </button>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'PlayerCard',
  props: {
    playerName: {
      type: String,
      required: true,
    },
    idPlayer: {
      type: String,
      required: true,
    },
  },
  setup(props, { emit }) {
    const onDelete = (): void => {
      emit('onDelete', props.idPlayer);
    };

    const onEdit = (): void => {
      emit('onEdit', props.idPlayer, props.playerName);
    };

    return {
      props,
      onDelete,
      onEdit,
    };
  },
});
</script>

<style lang='scss' scoped>
@import '@/assets/styles/variables';

.cs__player-name {
  border: 1.5px solid $shadow;
  border-radius: 14px;
  background: white;
  transition: all 0.2s ease;

  &:hover {
    border-color: $accent;
    box-shadow: $shadow-soft;
    transform: translateX(2px);
  }

  &__action {
    cursor: pointer;
    border: none;
    background: none;
    padding: 8px 12px;
    border-radius: 8px;
    transition: background-color 0.15s ease;

    &:hover {
      background-color: $accent-light;
    }

    &:focus-visible {
      outline: 2px solid $accent;
      outline-offset: 2px;
    }
  }
}
</style>
