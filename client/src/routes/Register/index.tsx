// Imports main functionality
import { useState, ChangeEvent, FormEvent, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios, { AxiosError } from "axios";

// Imports additional functionality
import { GlobalContext } from "../../context";
import { public_address } from "../../utils";

// Imports custom components
import { ErrorBox } from "../../components/ErrorBox";

export const Register = () => {
  const { setError } = useContext(GlobalContext);
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: "",
    password: "",
    passwordSubmit: "",
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

      if (
        !form.password.trim() ||
        !form.passwordSubmit.trim() ||
        !form.username.trim()
      )
        return;

      if (form.password !== form.passwordSubmit)
        throw new AxiosError("Axios Error", "404", undefined, undefined, {
          data: "Паролі не співпадають!",
          status: 404,
          statusText: "Невірний запит!",
          headers: {},
          config: {},
        });

      await axios.post(public_address + "/api/auth/register", {
        username: form.username,
        password: form.password,
      });

      setForm({
        username: "",
        password: "",
        passwordSubmit: "",
      });

      navigate("/login");
    } catch (err) {
      if (err instanceof AxiosError) {
        setError(new Error(err.response?.data));
      }
      console.error(err);
    }
  };

  return (
    <div className="flex justify-center p-12">
      <form className="p-4 w-full sm:max-w-[350px] rounded-lg border-[.1em] overflow-hidden">
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
        <div className="flex flex-col border-b-[.1em]">
          <label
            className="p-1 border-b-[.1em] text-center"
            htmlFor="password-submit"
          >
            Підтвердження паролю
          </label>
          <input
            onChange={handleChange}
            value={form.passwordSubmit}
            className="p-1 outline-none"
            name="passwordSubmit"
            id="password-submit"
            type="password"
            placeholder="Введіть пароль ще раз ..."
          />
        </div>
        <button
          onClick={handleSubmit}
          type="submit"
          className="w-full p-2 rounded-md mt-2 hover:bg-yellow-300 bg-yellow-200"
        >
          Зареєструватись
        </button>
      </form>
    </div>
  );
};
