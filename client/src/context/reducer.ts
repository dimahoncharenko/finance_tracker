// Imports additional functionality
import { initialState } from "./";

const ACTIONS = {
  INIT_TRANSACTIONS: "INIT_TRANSACTIONS",
  ADD_TRANSACTION: "ADD_TRANSACTION",
  DELETE_TRANSACTION: "DELETE_TRANSACTION",
  LOGIN_USER: "LOGIN_USER",
  LOGOUT_USER: "LOGOUT_USER",
  UPDATE_USER: "UPDATE_USER",
} as const;

type Transaction = {
  id: number;
  title: string;
  cost: number;
};

type User = {
  username: string;
  avatar: string;
};

export type State = {
  user: User;
  transactions: Transaction[];
};

export type Action = {
  type: keyof typeof ACTIONS;
  payload?: any;
};

export type TGlobalReducer = (state: State, action: Action) => State;

export const GlobalReducer: TGlobalReducer = (state, action) => {
  switch (action.type) {
    case "INIT_TRANSACTIONS":
      return {
        ...state,
        transactions: action.payload,
      };
    case "LOGIN_USER":
      return {
        user: action.payload,
        transactions: state.transactions,
      };
    case "LOGOUT_USER":
      return {
        user: initialState.user,
        transactions: state.transactions,
      };
    case "UPDATE_USER":
      return {
        user: action.payload,
        transactions: state.transactions,
      };
    case "DELETE_TRANSACTION":
      return {
        ...state,
        transactions: state.transactions.filter(
          (tr) => tr.id !== action.payload
        ),
      };
    case "ADD_TRANSACTION":
      return {
        ...state,
        transactions: state.transactions.concat(action.payload),
      };
    default:
      return state;
  }
};
