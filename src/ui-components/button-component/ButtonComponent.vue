<template>
  <button
    :style="composedClasses"
    :class="[buttonClass, 'py-3 m-1 rounded-lg cs__button']"
    :disabled="disabled"
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
  color: $contrast;
  font-weight: bold;
  min-width: 210px;
  transition: all 0.2s ease-in-out;
  border-radius: 50px;
  border-top: 1px solid $shadow;
  border-bottom: 1px solid $shadow;

  &:disabled {
    opacity: 0.4;
    box-shadow: none;
  }
}
</style>
