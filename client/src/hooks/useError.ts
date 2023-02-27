import { useReducer } from "react";

const ACTIONS = {
  CLEAR_ERROR: "CLEAR_ERROR",
  SET_ERROR: "SET_ERROR",
} as const;

export enum ERROR_CODES {
  INVALID_USERNAME = "INVALID_USERNAME",
  INVALID_EMAIL = "INVALID_EMAIL",
  INVALID_PASSWORD = "INVALID_PASSWORD",
  CREDENTIAL_ERROR = "CREDENTIAL_ERROR",
  SUM_IS_MISSED = "SUM_IS_MISSED",
  TITLE_IS_MISSED = "TITLE_IS_MISSED",
  TOO_SHORT_PASSWORD = "TOO_SHORT_PASSWORD",
  PASSWORDS_NOT_EQUAL = "PASSWORDS_NOT_EQUAL",
  TRANSACTIONS_FETCH_FAIL = "TRANSACTIONS_FETCH_FAIL",
  USER_FETCH_FAIL = "USER_FETCH_FAIL",
  IMPLEMENTATION_ERROR = "IMPLEMENTATION_ERROR",
  USER_ERROR = "USER_ERROR",
  EMAIL_IN_USE = "EMAIL_IN_USE",
}

export class WithError extends Error {
  public kind: "error" = "error";
  public cause: ERROR_CODES = ERROR_CODES.IMPLEMENTATION_ERROR;
}

export class WithoutError {
  public kind: "no_error" = "no_error";
}

export type ErrorState = WithoutError | WithError;

const initialState: ErrorState = new WithoutError();

export type Action =
  | {
      type: typeof ACTIONS["CLEAR_ERROR"];
    }
  | {
      type: typeof ACTIONS["SET_ERROR"];
      payload: WithError;
    };

type Reducer = (state: ErrorState, action: Action) => ErrorState;

export const defaultReducer: Reducer = (state, action) => {
  switch (action.type) {
    case "SET_ERROR":
      return action.payload;
    case "CLEAR_ERROR":
      return initialState;
  }
};

export const useError = (reducer = defaultReducer) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const setError = (error: WithError) =>
    dispatch({ type: "SET_ERROR", payload: error });

  const clearError = dispatch.bind(null, { type: "CLEAR_ERROR" });

  return { clearError, setError, error: state };
};
