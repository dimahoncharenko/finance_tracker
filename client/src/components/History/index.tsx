// Imports custom components
import { Item } from "./Item";

type Props = {
  transactions: Transaction[];
};

export const History = ({ transactions }: Props) => {
  return (
    <div className="mt-12 w-full sm:max-w-[400px]">
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
