<template>
  <ModalComponent
    :showModal="showModal"
    containerClass="p-8 w-80"
    @onCloseModal="onCloseModal"
  >
    <SelectComponent
      v-model="selectedOption"
      :options="selectOptions"
    >
      <template #label>
        <span class="font-bold">Tipo de juego</span>
      </template>
    </SelectComponent>

    <InputComponent
      v-model="value"
      placeholder="0"
      class="mt-3"
      :inputType="'number'"
    >
      <template #label>
        <span class="font-bold">{{ secondLabel }}</span>
      </template>
    </InputComponent>

    <ButtonComponent
      buttonClass="mx-auto block mt-6"
      :disabled="disabled"
      @click="onClick"
    >
      <p>Comenzar</p>
    </ButtonComponent>
  </ModalComponent>
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  reactive,
  toRefs,
  watch,
} from 'vue';

import { GAMES } from '@/db/enums/games.enum';
import ButtonComponent from '@/ui-components/button-component/ButtonComponent.vue';
import InputComponent from '@/ui-components/input-component/InputComponent.vue';
import ModalComponent from '@/ui-components/modal-component/ModalComponent.vue';
import SelectComponent from '@/ui-components/select-component/SelectComponent.vue';

export default defineComponent({
  components: {
    ModalComponent,
    InputComponent,
    SelectComponent,
    ButtonComponent,
  },
  name: 'GameSelection',
  props: {
    showModal: {
      type: Boolean,
      default: false,
      required: true,
    },
  },
  setup(props, { emit }) {
    const state = reactive({
      value: '',
      selectedOption: GAMES.SCORE_LIMIT,
      selectOptions: [
        {
          label: GAMES.SCORE_LIMIT,
          value: GAMES.SCORE_LIMIT,
        },
        {
          label: GAMES.ROUND_LIMIT,
          value: GAMES.ROUND_LIMIT,
        },
        {
          label: GAMES.PLAYOFFS,
          value: GAMES.PLAYOFFS,
        },
      ],
    });

    const secondLabel = computed(() => {
      switch (state.selectedOption) {
        case GAMES.SCORE_LIMIT:
          return 'Puntos';
        case GAMES.ROUND_LIMIT:
          return 'Rondas';
        case GAMES.PLAYOFFS:
          return 'Jugadores eliminados por ronda';
        default:
          return '';
      }
    });

    const parsedValue = computed(() => Number.parseInt(state.value, 10));
    const isValidValue = computed(() => Number.isInteger(parsedValue.value) && parsedValue.value > 0);
    const disabled = computed(() => !isValidValue.value);

    watch(() => state.selectedOption, () => {
      state.value = '';
    });

    const onCloseModal = (): void => {
      emit('onCloseModal');
    };

    const onClick = (): void => {
      if (!isValidValue.value) return;
      emit('onSubmit', state.selectedOption, `${parsedValue.value}`);
    };

    return {
      ...toRefs(state),
      secondLabel,
      disabled,
      onCloseModal,
      onClick,
      props,
    };
  },
});
</script>

<style lang='scss' scoped>
</style>
