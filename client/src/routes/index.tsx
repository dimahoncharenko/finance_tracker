// Imports main functionality
import { useContext } from "react";

// Imports additional functionality
import { Context } from "../utils";

// Imports components
import { Balance } from "../components/Balance";
import { History } from "../components/History";
import { AddTransaction } from "../components/AddTransaction";

export const Index = () => {
  const { transactions } = useContext(Context);

  return (
    <div className="flex flex-col items-center justify-center p-2">
      <Balance transactions={transactions} />
      <History transactions={transactions} />
      <AddTransaction />
    </div>
  );
};
