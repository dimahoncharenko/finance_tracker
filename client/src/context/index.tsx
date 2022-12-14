// Imports main functionality
import {
  useReducer,
  createContext,
  ReactNode,
  Dispatch,
  useEffect,
} from "react";
import axios, { AxiosError } from "axios";

// Imports additional functionality
import { GlobalReducer, State, Action } from "./reducer";
import { public_address } from "../utils";

// Imports hooks
import { useError, State as ErrorState } from "../hooks/useError";

export const initialState: State = {
  transactions: [],
  user: {
    username: "Гість",
    avatar: "/avatars/guest_logo.png",
  },
};

type Context = State & {
  dispatch: Dispatch<Action>;
  setError: (error: Error) => void;
  clearError: () => void;
  error: ErrorState | null;
};
export const GlobalContext = createContext<Context>({
  ...initialState,
  dispatch: () => {},
  setError: (err: Error) => {},
  clearError: () => {},
  error: null,
});

type Props = {
  children: ReactNode;
};
export const GlobalProvider = ({ children }: Props) => {
  const [state, dispatch] = useReducer(GlobalReducer, initialState);
  const { error, clearError, setError } = useError();

  useEffect(() => {
    const refresh = async () => {
      try {
        const token = localStorage.getItem("token")!;

        const restore = await axios(public_address + "/api/auth/restore", {
          headers: {
            token: token,
          },
        });

        const restoredUser = restore.data;

        dispatch({ type: "LOGIN_USER", payload: restoredUser });

        const response = await axios(public_address + "/api/transaction", {
          headers: {
            token: token,
          },
        });
        const transactions: State["transactions"] = response.data;

        dispatch({ type: "INIT_TRANSACTIONS", payload: transactions });
      } catch (err) {
        if (err instanceof AxiosError) {
          setError(err.response?.data);
        }
        console.log(err);
      }
    };

    localStorage.getItem("token") && refresh();
  }, [state.user.username]);

  return (
    <GlobalContext.Provider
      value={{
        user: state.user,
        transactions: state.transactions,
        dispatch,
        error,
        setError,
        clearError,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};
