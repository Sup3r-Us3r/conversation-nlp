export interface StateManager {
  getState: <T = any>(userId: string) => ConversationState<T>;
  updateState: <T = any>(userId: string, newContext: T) => void;
}

export interface ConversationState<T> {
  userId: string;
  context: T;
}

class StateManagerService implements StateManager {
  private states: Map<string, ConversationState<any>> = new Map();

  public getState<T = any>(userId: string): ConversationState<T> {
    let state = this.states.get(userId);

    if (!state) {
      state = { userId, context: {} };
      this.states.set(userId, state);
    }

    return state;
  }

  public updateState<T = any>(userId: string, newContext: T) {
    const state = this.getState(userId);

    state.context = { ...state.context, ...newContext };

    this.states.set(userId, state);
  }
}

export const stateManager = new StateManagerService();
