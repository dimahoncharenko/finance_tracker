const ACTIONS = {
  ADD_TRANSACTION: "ADD_TRANSACTION",
  DELETE_TRANSACTION: "DELETE_TRANSACTION",
  GET_TRANSACTIONS: "GET_TRANSACTIONS",
} as const;

type Transaction = {
  id: number;
  title: string;
  cost: number;
};

export type State = {
  transactions: Transaction[];
};

export type Action = {
  type: keyof typeof ACTIONS;
  payload?: any;
};

export type TGlobalReducer = (state: State, action: Action) => State;

export const GlobalReducer: TGlobalReducer = (state, action) => {
  switch (action.type) {
    case "GET_TRANSACTIONS":
      return state;
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
