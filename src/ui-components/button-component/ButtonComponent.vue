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
      state.innerClasses = ' slide-out-blurred-top';

      setTimeout(() => {
        emit('onClick');
      }, 500);
    };

    return {
      onClick,
      composedClasses,
      ...toRefs(state),
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

.slide-out-blurred-top {
  -webkit-animation: slide-out-blurred-top 0.45s cubic-bezier(0.755, 0.050, 0.855, 0.060) both;
        animation: slide-out-blurred-top 0.45s cubic-bezier(0.755, 0.050, 0.855, 0.060) both;
}

@-webkit-keyframes slide-out-blurred-top {
  0% {
    -webkit-transform: translateY(0) scaleY(1) scaleX(1);
            transform: translateY(0) scaleY(1) scaleX(1);
    -webkit-transform-origin: 50% 0%;
            transform-origin: 50% 0%;
    -webkit-filter: blur(0);
            filter: blur(0);
    opacity: 1;
  }
  100% {
    -webkit-transform: translateY(-1000px) scaleY(2) scaleX(0.2);
            transform: translateY(-1000px) scaleY(2) scaleX(0.2);
    -webkit-transform-origin: 50% 0%;
            transform-origin: 50% 0%;
    -webkit-filter: blur(40px);
            filter: blur(40px);
    opacity: 0;
  }
}
@keyframes slide-out-blurred-top {
  0% {
    -webkit-transform: translateY(0) scaleY(1) scaleX(1);
            transform: translateY(0) scaleY(1) scaleX(1);
    -webkit-transform-origin: 50% 0%;
            transform-origin: 50% 0%;
    -webkit-filter: blur(0);
            filter: blur(0);
    opacity: 1;
  }
  100% {
    -webkit-transform: translateY(-1000px) scaleY(2) scaleX(0.2);
            transform: translateY(-1000px) scaleY(2) scaleX(0.2);
    -webkit-transform-origin: 50% 0%;
            transform-origin: 50% 0%;
    -webkit-filter: blur(40px);
            filter: blur(40px);
    opacity: 0;
  }
}

</style>
