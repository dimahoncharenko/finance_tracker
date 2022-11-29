// Imports main functionality
import { useContext } from "react";

// Imports additional functionality
import { GlobalContext } from "../../context";

export const Balance = () => {
  const { transactions } = useContext(GlobalContext);

  return (
    <section className="w-full sm:max-w-[400px]">
      <div className="py-2 mt-6 text-center">
        <p className="text-2xl font-light m-0 balance">Ваш баланс</p>
        <span className="text-3xl font-bold">
          {transactions.reduce((acc, curr) => acc + curr.cost, 0)} UAH
        </span>
      </div>
      <div className="flex shadow-md">
        <div className="flex-1 text-center p-2 px-6  border-[lightgray] border-r-[1px]">
          <p>Прибуток</p>
          <span className="text-green-300">
            {transactions
              .filter((tr) => tr.cost > 0)
              .reduce((acc, curr) => acc + curr.cost, 0)}{" "}
            UAH
          </span>
        </div>
        <div className="flex-1 text-center p-2 px-6">
          <p>Витрати</p>
          <span className="text-red-300">
            {transactions
              .filter((tr) => tr.cost < 0)
              .reduce((acc, curr) => acc + curr.cost, 0)}{" "}
            UAH
          </span>
        </div>
      </div>
    </section>
  );
};
