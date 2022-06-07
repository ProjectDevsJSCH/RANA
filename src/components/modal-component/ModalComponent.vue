<template>
  <transition v-show="showModal" name="modal">
    <div class="absolute top-0 left-0 cs__modal-mask">
      <div :class="[containerClass, 'cs__modal__content p-2']">
        <button class="absolute right-2 top-2" @click="closeModal">
          <span class="font-bold">X</span>
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
    const closeModal = () => {
      emit('closeModal');
    };

    return { closeModal, props };
  },
});
</script>

<style lang='scss'>
@import '@/assets/styles/variables';

.cs__modal-mask {
  height: 100vh;
  width: 100vw;
  background-color: rgba($color: $green-darker, $alpha: 0.8);
  backdrop-filter: blur(2px);
}

.cs__modal__content {
  position: absolute;
  top: 40%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: $green-base;
}
</style>
