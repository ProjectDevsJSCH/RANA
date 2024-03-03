<template>
  <button
    :style="composedClasses"
    :class="[buttonClass, 'py-3 m-1 rounded-lg cs__button__glass', innerClasses]"
    :disabled="disabled"
    @click="onClick"
  >
    <slot />
  </button>
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  reactive,
  toRefs,
} from 'vue';

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
    appendExitTransition: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, { emit }) {
    const state = reactive({
      innerClasses: '',
    });

    const { outline, color, backgroundColor } = props;

    const composedClasses = computed(() => ({
      border: outline ? `2px solid ${color}` : '',
      'background-color': backgroundColor,
    }));

    const onClick = (): void => {
      if (props.appendExitTransition) {
        state.innerClasses = 'puff-out-center';
      }

      setTimeout(() => {
        emit('onClick');
      }, 350);
    };

    return {
      ...toRefs(state),
      onClick,
      composedClasses,
    };
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
.cs__button__glass {
  @apply px-2 font-bold min-w-[150px];

  background: linear-gradient(170deg, rgba($main200, 0.8) 20%, $main300 70%);
  box-shadow: 0px 0px 4px 0px $main500;
  backdrop-filter: blur(1px);
  border: 1px solid $main200;
  transition: all 0.3s ease-in-out;
}

.puff-out-center {
  -webkit-animation: puff-out-center 1s cubic-bezier(0.165, 0.840, 0.440, 1.000) both;
        animation: puff-out-center 1s cubic-bezier(0.165, 0.840, 0.440, 1.000) both;
}

@-webkit-keyframes puff-out-center {
  0% {
    -webkit-transform: scale(1);
            transform: scale(1);
    -webkit-filter: blur(0px);
            filter: blur(0px);
    opacity: 1;
  }
  100% {
    -webkit-transform: scale(2);
            transform: scale(2);
    -webkit-filter: blur(4px);
            filter: blur(4px);
    opacity: 0;
  }
}
@keyframes puff-out-center {
  0% {
    -webkit-transform: scale(1);
            transform: scale(1);
    -webkit-filter: blur(0px);
            filter: blur(0px);
    opacity: 1;
  }
  100% {
    -webkit-transform: scale(2);
            transform: scale(2);
    -webkit-filter: blur(4px);
            filter: blur(4px);
    opacity: 0;
  }
}

</style>
