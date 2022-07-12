<template>
  <transition v-show="showModal" name="modal">
    <div class="absolute top-0 left-0 cs__modal-mask">
      <div ref="content" :class="[containerClass, 'cs__modal__content p-2']">
        <button class="absolute bg-white rounded-full -right-3 -top-3"
                @click="onCloseModal"
        >
          <img :src="require('@/assets/icons/closeIcon.svg')" alt="">
        </button>
        <slot />
      </div>
    </div>
  </transition>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';

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
    const content = ref(null);

    const onCloseModal = (): void => {
      emit('onCloseModal');
    };

    return {
      content,
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
  width: 100vw;
  background-color: rgba($color: $dark, $alpha: 0.8);
  backdrop-filter: blur(2px);
}

.cs__modal__content {
  position: absolute;
  top: 40%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: white;
}
</style>
