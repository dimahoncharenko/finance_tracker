// Imports main functionality
import { useState, ChangeEvent, FormEvent, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useQuery } from "react-query";

// Imports additional functionality
import { Context } from "../../utils";
import { ERROR_CODES, WithError } from "../../hooks/useError";

// Imports custom components
import { ErrorBox } from "../../components/ErrorBox";
import { FormButton } from "../../components/FormButton";

export const Login = () => {
  const navigate = useNavigate();
  const { signIn, setError, error, user } = useContext(Context);

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });

  useQuery({
    queryKey: ["login", user.kind],
    queryFn: () => {
      user.kind === "user" && navigate("/");
    },
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

      if (!form.password.trim() || !form.email.trim() || !form.username.trim())
        return;

      await signIn({
        username: form.username,
        email: form.email.toLowerCase(),
        password: form.password,
      });

      setForm({
        username: "",
        password: "",
        email: "",
      });
    } catch (err) {
      if (err instanceof WithError) {
        setError(err);
      }
    }
  };

  return (
    <div className="flex justify-center p-12">
      <form
        onSubmit={handleSubmit}
        className="p-4 w-full sm:max-w-[350px] rounded-lg border-[.1em] overflow-hidden"
      >
        <div className="flex flex-col border-b-[.1em]">
          <label className="p-1 border-b-[.1em] text-center" htmlFor="username">
            Ім'я користувача
          </label>
          {error.kind === "error" &&
            error.cause === ERROR_CODES.INVALID_USERNAME && <ErrorBox />}
          <input
            onChange={handleChange}
            value={form.username}
            className="p-1 outline-none"
            name="username"
            autoComplete="username"
            id="username"
            type="text"
            placeholder="Введіть ваше ім'я ..."
          />
        </div>
        <div className="flex flex-col border-b-[.1em]">
          <label className="p-1 border-b-[.1em] text-center" htmlFor="email">
            Пошта
          </label>
          {error.kind === "error" &&
            error.cause === ERROR_CODES.INVALID_EMAIL && <ErrorBox />}
          <input
            onChange={handleChange}
            value={form.email}
            className="p-1 outline-none"
            name="email"
            id="email"
            type="email"
            autoComplete="email"
            placeholder="Введіть вашу пошту ..."
          />
        </div>
        <div className="flex flex-col border-b-[.1em]">
          <label className="p-1 border-b-[.1em] text-center" htmlFor="password">
            Пароль
          </label>
          {error.kind === "error" &&
            error.cause === ERROR_CODES.INVALID_PASSWORD && <ErrorBox />}
          <input
            onChange={handleChange}
            value={form.password}
            className="p-1 outline-none"
            name="password"
            id="password"
            type="password"
            autoComplete="current-password"
            placeholder="Введіть пароль ..."
          />
        </div>
        <FormButton.LoginButton color="#40e495">Увійти</FormButton.LoginButton>
        <Link to="/register" className="text-slate-500 text-xs hover:underline">
          Псс.. Не маєш акаунту? Глянь сюди!
        </Link>
      </form>
    </div>
  );
};
