// Imports main functionality
import { useContext } from "react";

// Imports additional functionality
import { useSwitch } from "../../hooks/useSwitch";
import { Context } from "../../utils";

// Imports styling utils
import { BsTrash } from "react-icons/bs";

// Imports components
import { HopWindow } from "../HopWindow";

type Props = {
  id: string;
  title: string;
  cost: number;
};

export const Item = ({ id, title, cost }: Props) => {
  const { deleteTransaction } = useContext(Context);
  const { isTurnedOn, switchOn, switchOff } = useSwitch();

  return (
    <li
      onMouseEnter={() => switchOn()}
      onMouseLeave={() => switchOff()}
      className={`
        grid grid-cols-10 grid-rows-1 w-full p-1 gap-2
         ${
           cost >= 0 ? "border-r-[#56e67e]" : "border-r-[#e14959]"
         } border-r-[.4em]
        shadow-sm rounded-sm hover:shadow-md cursor-pointer`}
    >
      <div className="flex col-span-9">
        <span>{title}</span>
        <span className="ml-auto">{cost} UAH</span>
      </div>
      <HopWindow
        isTurnedOn={isTurnedOn}
        embeddedStyles="justify-self-center col-span-1"
      >
        <div>
          <button onClick={() => deleteTransaction(id)}>
            <BsTrash className="text-xl hover:text-red-300 -mb-[.1em]" />
          </button>
        </div>
      </HopWindow>
    </li>
  );
};
