// Imports main functionality
import { useContext, useEffect, MouseEvent } from "react";

// Imports additional functionality
import { GlobalContext } from "../../context";

export const ErrorBox = () => {
  const { error, clearError } = useContext(GlobalContext);

  useEffect(() => {
    clearError();
  }, []);

  const handleClick = (e: MouseEvent<HTMLDivElement>) => {
    clearError();
  };

  return (
    <>
      {error?.message && (
        <div
          onClick={handleClick}
          className="bg-red-300 border-[#c93535] hover:bg-[#c93535] cursor-pointer text-white rounded-lg border-[1.5px] px-6 py-4 text-center"
        >
          {error.message?.message}
        </div>
      )}
    </>
  );
};
