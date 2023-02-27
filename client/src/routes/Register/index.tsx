// Imports main functionality
import { useState, ChangeEvent, FormEvent, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "react-query";

// Imports additional functionality
import { Context } from "../../utils";
import { WithError, ERROR_CODES } from "../../hooks/useError";

// Imports custom components
import { ErrorBox } from "../../components/ErrorBox";
import { FormButton } from "../../components/FormButton";

export const Register = () => {
  const navigate = useNavigate();
  const { register, setError, error, user } = useContext(Context);
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    passwordSubmit: "",
  });

  useQuery({
    queryKey: ["register", user.kind],
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

      if (
        !form.password.trim() ||
        !form.passwordSubmit.trim() ||
        !form.username.trim()
      )
        return;

      if (form.password.length < 8) {
        const err = new WithError(
          "Пароль повинен складатись як мінімум з 8 символів!"
        );
        err.cause = ERROR_CODES.TOO_SHORT_PASSWORD;

        throw err;
      }

      if (form.password !== form.passwordSubmit) {
        const err = new WithError("Паролі не співпадають!");
        err.cause = ERROR_CODES.PASSWORDS_NOT_EQUAL;

        throw err;
      }

      await register({
        email: form.email.toLowerCase(),
        password: form.password,
        username: form.username,
      });

      setForm({
        username: "",
        email: "",
        password: "",
        passwordSubmit: "",
      });
    } catch (err) {
      if (err instanceof WithError) {
        setError(err);
      }
    }
  };

  return (
    <div className="flex justify-center p-12">
      <form className="p-4 w-full sm:max-w-[350px] rounded-lg border-[.1em] overflow-hidden">
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
          <label className="p-1 border-b-[.1em] text-center" htmlFor="email">
            Пошта
          </label>
          {error.kind === "error" &&
            error.cause === ERROR_CODES.EMAIL_IN_USE && <ErrorBox />}
          <input
            onChange={handleChange}
            value={form.email}
            className="p-1 outline-none"
            name="email"
            autoComplete="email"
            id="email"
            type="email"
            placeholder="Введіть вашу пошту ..."
          />
        </div>
        <div className="flex flex-col border-b-[.1em]">
          <label className="p-1 border-b-[.1em] text-center" htmlFor="password">
            Пароль
          </label>
          {error.kind === "error" &&
            error.cause === ERROR_CODES.TOO_SHORT_PASSWORD && <ErrorBox />}
          <input
            onChange={handleChange}
            value={form.password}
            className="p-1 outline-none"
            name="password"
            id="password"
            type="password"
            placeholder="Введіть пароль ..."
            autoComplete="new-password"
          />
        </div>
        <div className="flex flex-col border-b-[.1em]">
          <label
            className="p-1 border-b-[.1em] text-center"
            htmlFor="password-submit"
          >
            Підтвердження паролю
          </label>
          {error.kind === "error" &&
            error.cause === ERROR_CODES.PASSWORDS_NOT_EQUAL && <ErrorBox />}
          <input
            onChange={handleChange}
            value={form.passwordSubmit}
            className="p-1 outline-none"
            name="passwordSubmit"
            id="password-submit"
            type="password"
            autoComplete="new-password"
            placeholder="Введіть пароль ще раз ..."
          />
        </div>
        <FormButton.RegisterButton onClick={handleSubmit} color="#6140e4">
          Зареєструватись
        </FormButton.RegisterButton>
      </form>
    </div>
  );
};
