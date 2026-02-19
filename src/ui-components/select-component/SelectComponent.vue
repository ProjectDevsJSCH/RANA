<template>
  <div>
    <label
      for="select"
      class="flex flex-col"
    >
      <slot name="label" />
      <select
        :class="[selectClass, 'mt-2 cs__select p-2 rounded-lg']"
        @change="onChange"
      >
        <option
          v-for="option in options"
          :key="option.label"
          :value="option.value"
        >
          {{ option.label }}
        </option>
      </select>
    </label>
  </div>
</template>

<script lang="ts">
import {
  defineComponent, PropType,
} from 'vue';

import { SelectOptions } from './interface';

export default defineComponent({
  name: 'SelectComponent',
  props: {
    modelValue: {
      type: String,
      default: '',
      required: true,
    },
    options: {
      type: Array as PropType<SelectOptions[]>,
      default: () => [],
      required: true,
    },
    selectClass: {
      type: String,
      default: '',
    },
  },
  setup(props, { emit }) {
    const onChange = (event: Event): void => {
      emit('update:modelValue', (event.target as HTMLInputElement).value as string);
    };

    return {
      onChange,
      props,
    };
  },
});
</script>

<style lang='scss' scoped>
@import '@/assets/styles/variables';

.cs__select {
  border: 1.5px solid $shadow;
  background-color: white;
  border-radius: 12px;
  padding: 10px 14px;
  font-size: 14px;
  transition: all 0.2s ease;
  cursor: pointer;

  &:focus {
    border-color: $accent;
    box-shadow: 0 0 0 3px $accent-light;
    outline: none;
  }
}
</style>
