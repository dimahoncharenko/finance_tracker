// Imports main functionality
import {
  createContext,
  ReactNode,
  useState,
  Dispatch,
  SetStateAction,
} from "react";
import { useQuery } from "react-query";
import {
  getDocs,
  doc,
  deleteDoc,
  setDoc,
  getDoc,
  collection,
} from "firebase/firestore";
import { getDownloadURL, ref } from "firebase/storage";

// Imports additional functionality
import {
  useError,
  WithoutError,
  WithError,
  ERROR_CODES,
} from "../hooks/useError";
import { NoUser, useAuth, Credentials } from "../hooks/useAuth";
import { firestore, storage } from "./";
import { FirebaseError } from "firebase/app";

type Props = {
  children: ReactNode;
};

export class NoAccount {
  public kind: "no_account" = "no_account";
}

export type AccountData = {
  username: string;
  email: string;
  avatar: string;
};
export class WithAccount {
  public kind: "account_data" = "account_data";
  constructor(public data: AccountData) {}
}

type Account = NoAccount | WithAccount;

type AUTH = ReturnType<typeof useAuth>;
type ERROR_PROPS = ReturnType<typeof useError>;
type ContextType = {
  user: AUTH["user"];
  account: Account;
  logOut: AUTH["logOut"];
  signIn: (payload: {
    username: string;
    email: string;
    password: string;
  }) => Promise<void>;
  register: (payload: Credentials & { username: string }) => Promise<void>;
  transactions: Transaction[];
  deleteTransaction: (id: string) => void;
  addTransaction: (payload: Transaction) => void;
  setAccount: Dispatch<SetStateAction<Account>>;
} & ERROR_PROPS;

export const Context = createContext<ContextType>({
  user: new NoUser(),
  account: new NoAccount(),
  setAccount: () => {},
  signIn: () => Promise.resolve(),
  register: () => Promise.resolve(),
  logOut: () => Promise.resolve(),
  deleteTransaction: () => {},
  addTransaction: () => {},
  transactions: [],
  clearError: () => {},
  setError: () => {},
  error: new WithoutError(),
});

export const AuthProvider = ({ children }: Props) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const { user, signIn, register, logOut } = useAuth();
  const { clearError, setError, error } = useError();
  const [account, setAccount] = useState<Account>(new NoAccount());

  useQuery({
    queryKey: ["transactions", user.kind],
    queryFn: async () => {
      try {
        if (user.kind === "user") {
          let transactions: Transaction[] = [];
          const res = await getDocs(
            collection(firestore, `transactions/${user.data.uid}/list`)
          );
          res.forEach((doc) => transactions.push(doc.data() as Transaction));

          setTransactions(transactions);
        } else {
          setTransactions([]);
        }
      } catch (err) {
        if (err instanceof WithError) {
          setError(err);
        }
      }
    },
  });

  useQuery({
    queryKey: ["user", user.kind],
    queryFn: async () => {
      try {
        if (user.kind === "user") {
          const account = await getDoc(
            doc(firestore, `users/${user.data.email}`)
          );

          const res = account.data();

          res &&
            setAccount(
              () =>
                new WithAccount({
                  username: res.username,
                  avatar: res.avatar,
                  email: res.email,
                })
            );
        } else {
          setAccount(() => new NoAccount());
        }
      } catch (err) {
        if (err instanceof WithError) {
          setError(err);
        }
      }
    },
  });

  const deleteTransaction = async (id: string) => {
    try {
      if (user.kind === "user") {
        await deleteDoc(
          doc(firestore, `transactions/${user.data.uid}/list/${id}`)
        );
        setTransactions((prev) => prev.filter((tr) => tr.id !== id));
      } else {
        let err = new WithError(
          "Користувач не авторизований для даної операції!"
        );
        err.cause = ERROR_CODES.TRANSACTIONS_FETCH_FAIL;

        throw err;
      }
    } catch (err) {
      if (err instanceof WithError) {
        setError(err);
      }
    }
  };

  const addTransaction = async (payload: Transaction) => {
    try {
      if (user.kind === "user") {
        await setDoc(
          doc(firestore, `transactions/${user.data.uid}/list/${payload.id}`),
          payload
        );
        setTransactions((prev) => [...prev, payload]);
      } else {
        let err = new WithError(
          "Користувач не авторизований для даної операції!"
        );
        err.cause = ERROR_CODES.TRANSACTIONS_FETCH_FAIL;

        throw err;
      }
    } catch (err) {
      if (err instanceof WithError) {
        setError(err);
      }
    }
  };

  const logIn = async (payload: {
    username: string;
    email: string;
    password: string;
  }) => {
    try {
      const request = await getDoc(
        doc(firestore, `users/${payload.email.toLowerCase()}`)
      );
      const candidate = request.data();

      if (candidate && candidate.username !== payload.username) {
        const err = new WithError("Ім'я користувача не співпадає!");
        err.cause = ERROR_CODES.INVALID_USERNAME;

        throw err;
      }

      await signIn(payload);
    } catch (err) {
      if (err instanceof WithError) {
        setError(err);
      } else if (err instanceof FirebaseError) {
        let errorInstance = new WithError(err.message);
        if (err.code === "auth/wrong-password") {
          errorInstance.message = "Невірний пароль";
          errorInstance.cause = ERROR_CODES.INVALID_PASSWORD;
        } else if (err.code === "auth/user-not-found") {
          errorInstance.message = "Почта не знайдена!";
          errorInstance.cause = ERROR_CODES.INVALID_EMAIL;
        }

        setError(errorInstance);
      }
    }
  };

  const signUp = async ({
    password,
    ...rest
  }: {
    username: string;
    email: string;
    password: string;
  }) => {
    try {
      await register({ ...rest, password });

      const url = await getDownloadURL(ref(storage, "images/avatar.png"));

      await setDoc(doc(firestore, `users/${rest.email.toLowerCase()}`), {
        ...rest,
        avatar: url,
      });
    } catch (err) {
      if (err instanceof FirebaseError) {
        let errorInstance = new WithError(err.message);

        if (err.code === "auth/email-already-in-use") {
          errorInstance.message = "Дана почта вже зареєстрована!";
          errorInstance.cause = ERROR_CODES.EMAIL_IN_USE;
        }

        setError(errorInstance);
      }
    }
  };

  return (
    <Context.Provider
      value={{
        user,
        account,
        signIn: logIn,
        register: signUp,
        logOut,
        transactions,
        deleteTransaction,
        addTransaction,
        clearError,
        setError,
        error,
        setAccount,
      }}
    >
      {children}
    </Context.Provider>
  );
};
