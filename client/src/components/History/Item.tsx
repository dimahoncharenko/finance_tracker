// Imports main functionality
import { useContext } from "react";

// Imports additional functionality
import { useSwitch } from "../../hooks/useSwitch";
import { GlobalContext } from "../../context";

// Imports styling utils
import { BsTrash } from "react-icons/bs";

// Imports components
import { HopWindow } from "../HopWindow";

type Props = {
  id: number;
  title: string;
  cost: number;
};

export const Item = ({ id, title, cost }: Props) => {
  const { isTurnedOn, switchOn, switchOff } = useSwitch();
  const { dispatch } = useContext(GlobalContext);

  const handleDelete = async (id: number) => {
    try {
      localStorage.getItem("token") &&
        (await fetch(`http://localhost:4000/api/transaction/${id}`, {
          method: "DELETE",
        }));

      dispatch({ type: "DELETE_TRANSACTION", payload: id });
    } catch (err) {
      if (err instanceof Error) {
        console.log(err);
      }
    }
  };

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
          <button onClick={() => handleDelete(id)}>
            <BsTrash className="text-xl hover:text-red-300 -mb-[.1em]" />
          </button>
        </div>
      </HopWindow>
    </li>
  );
};
