<template>
  <div>
    <button :style="composedClasses"
            class="cs__button m-1 rounded-lg py-3"
            @click="onClick"
    >
      <slot />
    </button>
  </div>
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
  },
  setup(props, { emit }) {
    const { outline, color } = props;

    const composedClasses = computed(() => {
      if (outline) {
        return {
          border: `2px solid ${color}`,
        };
      }

      return {};
    });

    const onClick = () => {
      emit('onClick');
    };

    return { onClick, composedClasses };
  },
});
</script>

<style lang='scss'>
@import '@/assets/styles/variables';

.cs__button {
  min-width: 210px;
  transition: all 0.2s ease-in-out;
  background-color: white;
  box-shadow: $green-darker 0px 25px 20px -20px;

  &:active  {
    transition: all 0.2s ease-in-out;
    background-color: $green-medium;
    box-shadow: rgba(50, 50, 93, 0.25) 0px 30px 60px -12px inset, rgba(0, 0, 0, 0.3) 0px 18px 36px -18px inset;
  }
}
</style>
