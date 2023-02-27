// Imports main functionality
import { useState, ChangeEvent, FormEvent, useContext } from "react";
import { uploadBytes, ref, getDownloadURL } from "firebase/storage";
import { setDoc, doc } from "firebase/firestore";
import { v4 } from "uuid";

// Imports additional functionality
import { storage, Context, firestore, WithAccount } from "../../utils";
import { WithError, ERROR_CODES } from "../../hooks/useError";

// Imports custom components
import { ErrorBox } from "../../components/ErrorBox";

export const User = () => {
  const [file, setFile] = useState<File | null>(null);
  const [username, setUsername] = useState("");
  const { account, user, setError, setAccount } = useContext(Context);

  const pickItem = (e: ChangeEvent<HTMLInputElement>) => {
    e.target.files && setFile(e.target.files[0]);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();

      if (!file && !username.trim()) {
        let err = new WithError("Заповніть хоча б одне поле перед відправкою!");
        err.cause = ERROR_CODES.CREDENTIAL_ERROR;

        throw err;
      }

      if (user.kind === "user" && account.kind === "account_data") {
        let updatedUser = {
          avatar: account.data.avatar,
          username: account.data.username,
        };

        if (file) {
          const imageRef = ref(
            storage,
            `images/${user.data.email}/${v4().concat(file.name)}`
          );

          await uploadBytes(imageRef, file);

          const url = await getDownloadURL(imageRef);

          updatedUser.avatar = url;
        }

        setFile(null);

        if (username) updatedUser.username = username;

        await setDoc(doc(firestore, `users/${user.data.email}`), {
          ...updatedUser,
        });

        setAccount((prev) => {
          if (prev.kind === "account_data") {
            return new WithAccount({
              ...prev.data,
              avatar: updatedUser.avatar,
              username: updatedUser.username,
            });
          } else return prev;
        });

        setUsername("");
      }
    } catch (err) {
      if (err instanceof WithError) {
        setError(err);
      }
    }
  };

  return (
    <div className="flex flex-col items-center">
      <div className="shadow-md p-6 rounded-lg">
        {account.kind === "account_data" && (
          <div className="flex items-center gap-2 p-4">
            <img
              className="w-8 h-8 object-cover rounded-full"
              src={account.data.avatar}
              alt={`${account.data.username}'s Logo`}
            />
            <div>{account.data.username}</div>
          </div>
        )}
        <form
          onSubmit={(e) => handleSubmit(e)}
          className="p-4 w-full rounded-lg border-[.1em] overflow-hidden"
        >
          <div className="flex flex-col border-b-[.1em]">
            <ErrorBox />
            <label
              style={{ lineHeight: "3em" }}
              className="border-b-[.1em] font-bold text-xl text-center"
              htmlFor="avatar"
            >
              Аватар користувача
            </label>
            <input
              className="p-1 outline-none file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100"
              value={""}
              onChange={pickItem}
              id="avatar"
              accept="image/*"
              type="file"
              disabled={account.kind === "no_account"}
            />

            <label
              style={{ lineHeight: "3em" }}
              className="border-b-[.1em] font-bold text-xl text-center"
              htmlFor="username"
            >
              Ім'я користувача
            </label>
            <input
              className="p-1 outline-none"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              id="username"
              type="text"
              placeholder="Введіть своє нове ім'я...'"
              disabled={account.kind === "no_account"}
            />
          </div>
          <button
            className="w-full p-4 text-white mt-4 bg-yellow-300"
            type="submit"
            disabled={account.kind === "no_account"}
          >
            Опублікувати
          </button>
        </form>
      </div>
    </div>
  );
};
