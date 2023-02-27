import { useState, useEffect } from "react";
import axios from "axios";
import {
  onAuthStateChanged,
  signOut,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  User as TUser,
} from "firebase/auth";

import { auth } from "../utils";

export class NoUser {
  public kind: "no_user" = "no_user";
}

export type UserData = {
  email: string;
  avatar: string;
  username: string;
};

export class User {
  public kind: "user" = "user";
  constructor(public data: TUser) {}
}

export type Credentials = {
  email: string;
  password: string;
};

export type LocalCredentials = {
  username: string;
  password: string;
};

export const useAuth = () => {
  const [user, setUser] = useState<User | NoUser>(new NoUser());

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(() => (currentUser ? new User(currentUser) : new NoUser()));
    });

    return () => unsubscribe();
  }, []);

  const signIn = async ({ email, password }: Credentials) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const signInLocal = async ({ username, password }: LocalCredentials) => {
    await axios.post("");
  };

  const register = async ({ email, password }: Credentials) => {
    await createUserWithEmailAndPassword(auth, email, password);
  };

  const logOut = async () => {
    await signOut(auth);
  };

  return { user, signIn, logOut, register };
};
