// Imports components
import { Balance } from "../components/Balance";
import { History } from "../components/History";
import { AddTransaction } from "../components/AddTransaction";

export const Index = () => {
  return (
    <div className="flex flex-col items-center justify-center p-2">
      <Balance />
      <History />
      <AddTransaction />
    </div>
  );
};
