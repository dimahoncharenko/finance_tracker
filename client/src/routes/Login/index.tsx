// Imports main functionality
import { useState, ChangeEvent, FormEvent, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios, { AxiosError } from "axios";

// Imports additional functionality
import { GlobalContext } from "../../context";
import { public_address } from "../../utils";

// Imports custom components
import { ErrorBox } from "../../components/ErrorBox";

export const Login = () => {
  const { dispatch, setError } = useContext(GlobalContext);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    password: "",
  });

  const handleChange = ({
    target: { name, value },
  }: ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    try {
      e.preventDefault();

      if (!form.password.trim() || !form.username.trim()) return;

      const request = await axios.post(
        public_address + "/api/auth/login",
        form,
        {
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
        }
      );

      const token = request.data.token;

      localStorage.setItem("token", `Bearer ${token}`);

      const restore = await axios(public_address + "/api/auth/restore", {
        headers: {
          token: `Bearer ${token}`,
        },
      });

      const restoredUser = restore.data;

      dispatch({ type: "LOGIN_USER", payload: restoredUser });

      setForm({
        username: "",
        password: "",
      });

      navigate("/");
    } catch (err) {
      if (err instanceof AxiosError) {
        console.log(err);
        setError(new Error(err.response?.data));
      }
    }
  };

  return (
    <div className="flex justify-center p-12">
      <form
        onSubmit={handleSubmit}
        className="p-4 w-full sm:max-w-[350px] rounded-lg border-[.1em] overflow-hidden"
      >
        <ErrorBox />
        <div className="flex flex-col border-b-[.1em]">
          <label className="p-1 border-b-[.1em] text-center" htmlFor="username">
            Ім'я користувача
          </label>
          <input
            onChange={handleChange}
            value={form.username}
            className="p-1 outline-none"
            name="username"
            id="username"
            type="text"
            placeholder="Введіть ваше ім'я ..."
          />
        </div>
        <div className="flex flex-col border-b-[.1em]">
          <label className="p-1 border-b-[.1em] text-center" htmlFor="password">
            Пароль
          </label>
          <input
            onChange={handleChange}
            value={form.password}
            className="p-1 outline-none"
            name="password"
            id="password"
            type="password"
            placeholder="Введіть пароль ..."
          />
        </div>
        <button
          type="submit"
          className="w-full p-2 rounded-md mt-2 hover:bg-yellow-300 bg-yellow-200"
        >
          Увійти
        </button>
        <Link to="/register" className="text-slate-500 text-xs hover:underline">
          Псс.. Не маєш акаунту? Глянь сюди!
        </Link>
      </form>
    </div>
  );
};
