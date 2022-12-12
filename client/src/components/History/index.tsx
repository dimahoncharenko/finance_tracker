// Imports main functionality
import { useContext, useEffect } from "react";

// Imports custom components
import { Item } from "./Item";
import { ErrorBox } from "../ErrorBox";

// Imports additional functionality
import { GlobalContext } from "../../context";

export const History = () => {
  const { transactions } = useContext(GlobalContext);

  return (
    <div className="mt-12 w-full sm:max-w-[400px]">
      <ErrorBox />
      <h2 className="py-1 mb-2 mt-4 font-bold border-b-[.1em]">
        Історія транзакцій
      </h2>
      <ul className="flex flex-col gap-1">
        {transactions.map((tr) => (
          <Item key={tr.id} {...tr} />
        ))}
      </ul>
    </div>
  );
};
