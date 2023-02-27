// Imports main functionality
import { useContext } from "react";

// Imports additional functionality
import { Context } from "../../utils";

export const ErrorBox = () => {
  const { error, clearError } = useContext(Context);

  if (error.kind === "no_error") return null;

  return (
    <div
      className="bg-red-300 text-white p-2 rounded-sm cursor-pointer hover:bg-red-400 hover:scale-[0.99] transition"
      onClick={clearError.bind(null)}
    >
      {error.message}
    </div>
  );
};
