import { useReducer } from "react";

const ACTIONS = {
  CLEAR_ERROR: "CLEAR_ERROR",
  SET_ERROR: "SET_ERROR",
} as const;

export type State = {
  message: Error | null;
};

const initialState: State = {
  message: null,
};

export type Action = {
  type: keyof typeof ACTIONS;
  payload?: Error;
};

type Reducer = (state: State, action: Action) => State;

export const defaultReducer: Reducer = (state, action) => {
  switch (action.type) {
    case "SET_ERROR":
      return {
        message: action.payload!,
      };
    case "CLEAR_ERROR":
      return initialState;
    default:
      return state;
  }
};

export const useError = (reducer = defaultReducer) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const setError = (error: Error) =>
    dispatch({ type: "SET_ERROR", payload: error });

  const clearError = dispatch.bind(null, { type: "CLEAR_ERROR" });

  return { clearError, setError, error: state };
};
