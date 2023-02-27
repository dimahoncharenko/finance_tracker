// Imports main functionality
import { useState, ChangeEvent, useContext } from "react";
import { v4 } from "uuid";

// Imports additional functionality
import { Context } from "../../utils";
import { WithError, ERROR_CODES } from "../../hooks/useError";

// Imports custom components
import { ErrorBox } from "../ErrorBox";

export const AddTransaction = () => {
  const { addTransaction, user, setError, error } = useContext(Context);
  const [form, setForm] = useState({
    title: "",
    sum: 0,
  });

  const handleSubmit = async () => {
    try {
      if (!form.sum || form.sum.toString().startsWith("0")) {
        let err = new WithError('Поле "сума" має бути заповненим!');
        err.cause = ERROR_CODES.SUM_IS_MISSED;
        throw err;
      }

      if (!form.title.trim()) {
        let err = new WithError('Поле "назва" має бути заповненим!');
        err.cause = ERROR_CODES.TITLE_IS_MISSED;
        throw err;
      }

      if (user.kind === "no_user") {
        let err = new WithError("Користувач не авторизований!");
        err.cause = ERROR_CODES.USER_ERROR;
        throw err;
      }

      let newTransaction = {
        title: form.title,
        cost: form.sum,
        userId: user.data.uid,
        id: v4(),
      };

      addTransaction(newTransaction);

      setForm({
        title: "",
        sum: 0,
      });
    } catch (err) {
      if (err instanceof WithError) {
        setError(err);
      }
    }
  };

  const handleChange = ({
    target: { name, value },
  }: ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="mt-12 w-full sm:max-w-[400px]">
      {error.kind === "error" && error.cause === ERROR_CODES.USER_ERROR && (
        <ErrorBox />
      )}
      <h2 className="py-1 mb-2 font-bold border-b-[.1em]">Нова транзакція</h2>
      <form className="rounded-lg border-[.1em] overflow-hidden">
        <div className="flex flex-col">
          <label className="p-1 border-b-[.1em]" htmlFor="text">
            Назва
          </label>
          {error.kind === "error" &&
            error.cause === ERROR_CODES.TITLE_IS_MISSED && <ErrorBox />}
          <input
            className="p-1 outline-none"
            name="title"
            id="text"
            type="text"
            value={form.title}
            onChange={handleChange}
            placeholder="Введіть назву ..."
            disabled={user.kind === "no_user"}
          />
        </div>
        <div className="flex flex-col border-t-[.1em]">
          <label className="p-1 border-b-[.1em]" htmlFor="cost">
            Сума
            <br />
            <span className="text-slate-400 text-xs">
              (Від'ємна - витрати, додатна - прибуток)
            </span>
          </label>
          {error.kind === "error" &&
            error.cause === ERROR_CODES.SUM_IS_MISSED && <ErrorBox />}
          <input
            className="p-1 outline-none"
            name="sum"
            id="cost"
            type="number"
            value={form.sum}
            onChange={handleChange}
            placeholder="Введіть суму ..."
            disabled={user.kind === "no_user"}
          />
        </div>
      </form>
      <button
        onClick={handleSubmit}
        className={`w-full p-2 rounded-md mt-2 hover:bg-yellow-300 bg-yellow-200 ${
          user.kind === "no_user" && "hover:cursor-not-allowed"
        }`}
        disabled={user.kind === "no_user"}
      >
        Додати транзакцію
      </button>
    </div>
  );
};
