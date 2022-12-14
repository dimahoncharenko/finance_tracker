// Imports main functionality
import { useEffect, useContext, useState, ChangeEvent, FormEvent } from "react";
import axios, { AxiosError } from "axios";

// Imports adiitional functionality
import { GlobalContext } from "../../context";
import { public_address } from "../../utils";

// Imports custom components
import { ErrorBox } from "../../components/ErrorBox";

export const User = () => {
  const token = localStorage.getItem("token");
  const { user, dispatch, setError } = useContext(GlobalContext);
  const [file, setFile] = useState<File | null>(null);
  const [username, setUsername] = useState("");

  useEffect(() => {
    const getUser = async () => {
      try {
        const request = await axios.get(public_address + "/api/user", {
          headers: {
            token: localStorage.getItem("token")!,
          },
        });

        const user = request.data;
        dispatch({ type: "LOGIN_USER", payload: user });
      } catch (err) {
        if (err instanceof AxiosError) {
          setError(new Error(err.response?.data));
        } else if (err instanceof Error) {
          if (err.name === "JsonWebTokenError") {
            return;
          }

          console.log(err);
        }
      }
    };

    localStorage.getItem("token") && getUser();
  }, [user.username]);

  const pickItem = (e: ChangeEvent<HTMLInputElement>) => {
    e.target.files && setFile(e.target.files[0]);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();

      const form = new FormData();
      file && form.append("file", file);
      form.append("username", username || user.username);

      const request = await axios.patch(public_address + "/api/user/", form, {
        headers: {
          "Content-Type": "multipart/form-data",
          token: localStorage.getItem("token")!,
        },
      });

      const result = await request.data;

      dispatch({
        type: "UPDATE_USER",
        payload: result,
      });

      setFile(null);
      setUsername("");
    } catch (err) {
      if (err instanceof Error) {
        console.log(err.message);
      }
    }
  };

  return (
    <div className="flex flex-col items-center">
      <div className="shadow-md p-6 rounded-lg">
        <ErrorBox />
        <div className="flex items-center gap-2 p-4">
          <img
            className="w-8 h-8 object-cover rounded-full"
            src={user.avatar}
            alt={`${user.username}'s Logo`}
          />
          <div>{user.username}</div>
        </div>
        <form
          onSubmit={(e) => handleSubmit(e)}
          className="p-4 w-full rounded-lg border-[.1em] overflow-hidden"
        >
          <div className="flex flex-col border-b-[.1em]">
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
              type="file"
              disabled={token ? false : true}
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
              disabled={token ? false : true}
            />
          </div>
          <button
            className="w-full p-4 text-white mt-4 bg-yellow-300"
            type="submit"
            disabled={token ? false : true}
          >
            Опублікувати
          </button>
        </form>
      </div>
    </div>
  );
};
