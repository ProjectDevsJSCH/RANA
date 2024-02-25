<template>
  <div class="flex flex-1">
    <div class="flex items-center justify-center flex-1 overflow-hidden">
      <div class="flex flex-col items-center">
        <PlayerSwipe
          @moreOptions="moreOptions"
          @displayPositions="displayPositions"
          @updatePositionsList="updatePositionsList"
        />
      </div>
    </div>
    <transition name="slide">
      <PositionsList
        ref="positionsList"
        :showPositions="showPositions"
        @onClosePositions="showPositions = false"
      />
    </transition>

    <ModalComponent
      containerClass="p-8 w-80"
      :showModal="showModalMoreOptions"
      @onCloseModal="showModalMoreOptions = false"
    >
      <ButtonComponent
        class="block mx-auto mt-6 text-center"
        @onClick="redirectToNewGame"
      >
        <span>Reiniciar juego</span>
      </ButtonComponent>
    </ModalComponent>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  reactive,
  toRefs,
  ref,
} from 'vue';
import { useRouter } from 'vue-router';

import PlayerSwipe from '@/components/player-swipe/PlayerSwipe.vue';
import PositionsList from '@/components/positions-list/PositionsList.vue';
import ButtonComponent from '@/ui-components/button-component/ButtonComponent.vue';
import ModalComponent from '@/ui-components/modal-component/ModalComponent.vue';

export default defineComponent({
  components: {
    ButtonComponent,
    ModalComponent,
    PositionsList,
    PlayerSwipe,
  },
  setup() {
    const state = reactive({
      showPositions: false,
      showModalMoreOptions: false,
    });

    const positionsList = ref<InstanceType<typeof PositionsList> | null>(null);
    const router = useRouter();

    const displayPositions = (): void => {
      state.showPositions = true;
    };

    const moreOptions = (): void => {
      state.showModalMoreOptions = true;
    };

    const redirectToNewGame = (): void => {
      router.push({ name: 'NewGame' });
    };

    const updatePositionsList = async (): Promise<void> => {
      await positionsList.value?.updatePositionsList();
    };

    return {
      ...toRefs(state),
      displayPositions,
      moreOptions,
      redirectToNewGame,
      updatePositionsList,
      positionsList,
    };
  },
});
</script>
