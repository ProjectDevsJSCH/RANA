<template>
  <div>
    <label for="input" class="flex flex-col">
      <slot name="label" />
      <input
        id="input"
        name="input"
        :class="[inputClass, 'mt-2 cs__input rounded-lg p-2']"
        :type="inputType"
        :value="modelValue"
        :placeholder="placeholder"
        @input="onInput"
      >
    </label>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'InputComponent',
  props: {
    modelValue: {
      type: String,
      default: '',
      required: true,
    },
    inputType: {
      type: String,
      default: 'text',
    },
    inputClass: {
      type: String,
      default: '',
    },
    placeholder: {
      type: String,
      default: '',
    },
  },
  setup(props, { emit }) {
    const onInput = (event: Event) => {
      emit('update:modelValue', (event.target as HTMLInputElement).value as string);
    };

    return { onInput, props };
  },
});
</script>

<style lang='scss' scoped>
@import '@/assets/styles/variables';
@import '@/assets/styles/mixins';

.cs__input {
  @include shadow-pressed-soft;
}

</style>
