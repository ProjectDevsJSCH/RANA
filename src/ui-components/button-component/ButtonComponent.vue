<template>
  <button
    :style="composedClasses"
    :class="[buttonClass, 'py-3 m-1 rounded-lg cs__button shadow-md']"
    :disabled="disabled"
    :aria-label="ariaLabel"
    @click="onClick"
  >
    <slot />
  </button>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';

export default defineComponent({
  name: 'ButtonComponent',
  props: {
    outline: {
      type: Boolean,
      default: false,
    },
    color: {
      type: String,
      default: '',
    },
    backgroundColor: {
      type: String,
      default: '',
    },
    buttonClass: {
      type: String,
      default: '',
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    ariaLabel: {
      type: String,
      default: '',
    },
  },
  setup(props, { emit }) {
    const { outline, color, backgroundColor } = props;

    const composedClasses = computed(() => ({
      border: outline ? `2px solid ${color}` : '',
      'background-color': backgroundColor,
    }));

    const onClick = (): void => {
      emit('onClick');
    };

    return { onClick, composedClasses };
  },
});
</script>

<style lang='scss' scoped>
@import '@/assets/styles/variables';
@import '@/assets/styles/mixins';

.cs__button {
  color: white;
  font-weight: bold;
  min-width: 210px;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  border-radius: 50px;
  background: $accent-gradient;
  border: none;
  box-shadow: $shadow-soft;
  cursor: pointer;
  letter-spacing: 0.3px;

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: $shadow-medium;
    filter: brightness(1.08);
  }

  &:active:not(:disabled) {
    transform: translateY(0);
    box-shadow: $shadow-soft;
    filter: brightness(0.95);
  }

  &:focus-visible {
    outline: 2px solid $accent;
    outline-offset: 2px;
  }

  &:disabled {
    opacity: 0.4;
    box-shadow: none;
    cursor: not-allowed;
    filter: grayscale(0.3);
  }
}
</style>
