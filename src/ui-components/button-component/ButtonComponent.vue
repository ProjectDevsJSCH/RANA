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
      default: '#111d13',
    },
    backgroundColor: {
      type: String,
      default: '#c4d4c5',
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
      border: outline ? `2px solid ${color}` : 'none',
      'background-color': backgroundColor || 'none',
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
  min-width: 210px;
  transition: all 0.2s ease-in-out;
  border-radius: 50px;
  @include shadow-flat;

  &:active {
    transition: all 0.2s ease-in-out;
    @include shadow-pressed-soft
  }

  &:disabled {
    opacity: 0.5;
    box-shadow: none;
  }
}
</style>
