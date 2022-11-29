// Imports main functionality
import { useReducer, createContext, ReactNode, Dispatch } from "react";

// Imports additional functionality
import { GlobalReducer, State, Action } from "./reducer";

const initialState: State = {
  transactions: [
    { id: 1, title: "Зарплатня", cost: 15000 },
    { id: 2, title: "Підручник", cost: -600 },
    { id: 3, title: "Смартфон", cost: -8000 },
  ],
};

type Context = State & { dispatch: Dispatch<Action> };
export const GlobalContext = createContext<Context>({
  ...initialState,
  dispatch: () => {},
});

type Props = {
  children: ReactNode;
};
export const GlobalProvider = ({ children }: Props) => {
  const [state, dispatch] = useReducer(GlobalReducer, initialState);

  return (
    <GlobalContext.Provider
      value={{ transactions: state.transactions, dispatch }}
    >
      {children}
    </GlobalContext.Provider>
  );
};
