<template>
  <transition v-show="showModal" name="modal">
    <div class="absolute top-0 left-0 cs__modal-mask">
      <div :class="[containerClass, 'cs__modal__content']">
        <button
          class="cs__modal__close"
          aria-label="Cerrar modal"
          @click="onCloseModal"
        >
          <img :src="require('@/assets/icons/closeIcon.svg')" alt="Cerrar">
        </button>
        <slot />
      </div>
    </div>
  </transition>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'ModalComponent',
  props: {
    showModal: {
      type: Boolean,
      default: true,
      required: true,
    },
    containerClass: {
      type: String,
      default: '',
    },
  },
  setup(props, { emit }) {
    const onCloseModal = (): void => {
      emit('onCloseModal');
    };

    return {
      onCloseModal,
      props,
    };
  },
});
</script>

<style lang='scss' scoped>
@import '@/assets/styles/variables';

.cs__modal-mask {
  height: 100vh;
  width: 100%;
  background-color: rgba($color: $dark, $alpha: 0.6);
  backdrop-filter: blur(8px);
  z-index: 100;
}

.cs__modal__content {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: white;
  border-radius: 20px;
  box-shadow: $shadow-strong;
  padding: 24px;
}

.cs__modal__close {
  position: absolute;
  right: -12px;
  top: -12px;
  background: white;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  box-shadow: $shadow-medium;
  cursor: pointer;
  transition: transform 0.2s ease;

  &:hover {
    transform: scale(1.1);
  }

  &:focus-visible {
    outline: 2px solid $accent;
    outline-offset: 2px;
  }

  img {
    width: 14px;
    height: 14px;
  }
}
</style>
