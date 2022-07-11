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
  defineComponent, PropType, reactive, toRefs,
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
    const state = reactive({
    });

    const onChange = (event: Event): void => {
      emit('update:modelValue', (event.target as HTMLInputElement).value as string);
    };

    return {
      ...toRefs(state),
      onChange,
      props,
    };
  },
});
</script>

<style lang='scss' scoped>
@import '@/assets/styles/variables';
@import '@/assets/styles/mixins';

.cs__select {
  border: 1px solid $erie-black-light;
  background-color: white;
}

</style>
