// Imports main functionality
import { useState, ChangeEvent, useContext } from "react";
import { v4 } from "uuid";

// Imports additional functionality
import { GlobalContext } from "../../context";

export const AddTransaction = () => {
  const { dispatch } = useContext(GlobalContext);

  const [form, setForm] = useState({
    title: "",
    sum: 0,
  });

  const handleSubmit = async () => {
    if (!form.sum || form.sum.toString().startsWith("0") || !form.title.trim())
      return;

    let newTransaction;

    if (localStorage.getItem("token")) {
      const request = await fetch(
        "http://localhost:4000/api/transaction/create",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            token: localStorage.getItem("token")!,
          },
          body: JSON.stringify({
            title: form.title,
            cost: form.sum,
          }),
        }
      );

      newTransaction = await request.json();
    }

    dispatch({
      type: "ADD_TRANSACTION",
      payload: newTransaction || {
        title: form.title,
        cost: Number(form.sum),
        id: v4(),
      },
    });

    setForm({
      title: "",
      sum: 0,
    });
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
      <h2 className="py-1 mb-2 font-bold border-b-[.1em]">Нова транзакція</h2>
      <form className="rounded-lg border-[.1em] overflow-hidden">
        <div className="flex flex-col">
          <label className="p-1 border-b-[.1em]" htmlFor="text">
            Текст
          </label>
          <input
            className="p-1 outline-none"
            name="title"
            id="text"
            type="text"
            value={form.title}
            onChange={handleChange}
            placeholder="Введіть назву ..."
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
          <input
            className="p-1 outline-none"
            name="sum"
            id="cost"
            type="number"
            value={form.sum}
            onChange={handleChange}
            placeholder="Введіть суму ..."
          />
        </div>
      </form>
      <button
        onClick={handleSubmit}
        className="w-full p-2 rounded-md mt-2 hover:bg-yellow-300 bg-yellow-200"
      >
        Додати транзакцію
      </button>
    </div>
  );
};
