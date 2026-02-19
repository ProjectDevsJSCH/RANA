import { reactive, toRefs } from 'vue';

import { GameApi } from '@/api/game.api';
import { PlayerStore } from '@/model/tables/player.model';

const state = reactive({
  currentPlayer: {} as PlayerStore,
  currentRound: -1,
  nextPlayerName: '' as string | undefined,
  winner: '',
  isLoading: false,
  error: '',
});

export function useGame(): any {
  const loadGameState = async (): Promise<void> => {
    state.isLoading = true;
    state.error = '';

    try {
      state.currentPlayer = await GameApi.getCurrentPlayer();
      state.currentRound = await GameApi.getCurrentRound();
      state.nextPlayerName = await GameApi.getNextPlayerName();
    } catch (err) {
      state.error = 'Error al cargar el estado del juego';
      console.error(err);
    } finally {
      state.isLoading = false;
    }
  };

  const advanceTurn = async (score: number): Promise<void> => {
    state.isLoading = true;
    state.error = '';

    try {
      state.currentPlayer = await GameApi.setNextTurn(score);
      state.currentRound = await GameApi.getCurrentRound();
      state.nextPlayerName = await GameApi.getNextPlayerName();
    } catch (err) {
      state.error = 'Error al avanzar turno';
      console.error(err);
    } finally {
      state.isLoading = false;
    }
  };

  const checkWinner = async (): Promise<string> => {
    try {
      state.winner = await GameApi.checkGameWinner();

      return state.winner;
    } catch (err) {
      state.error = 'Error al verificar ganador';
      console.error(err);

      return '';
    }
  };

  const clearError = (): void => {
    state.error = '';
  };

  return {
    ...toRefs(state),
    loadGameState,
    advanceTurn,
    checkWinner,
    clearError,
  };
}
