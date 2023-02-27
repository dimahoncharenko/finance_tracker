// Imports main functionality
import { useContext } from "react";
import { Link } from "react-router-dom";

// Imports styling utils
import vision from "../../images/vision.png";

// Imports additional functionality
import { Context } from "../../utils";

export const Navbar = () => {
  const { user, logOut, account } = useContext(Context);

  return (
    <header className="bg-blue-100">
      <nav className="flex justify-between items-center">
        <Link
          to="/"
          className=" px-4 inline-flex flex-col text-lg items-center font-bold"
        >
          SMART <img className="w-12" src={vision} alt="Logo" /> ТРЕКЕР
        </Link>
        <span className="text-center">
          {user.kind === "user" ? null : (
            <>
              <span>Привіт @Гість</span>
              <br />
              <span className="text-xs text-slate-500">
                (Псс.. Для створення транзакцій потрібно увійти в систему)
              </span>
            </>
          )}
          <Link to="/user" className="cursor-pointer font-bold text-sky-300">
            {account.kind === "account_data" && (
              <span className="min-w-max flex gap-1 items-center">
                <img
                  className="w-10 h-10 object-contain rounded-full"
                  src={account.data.avatar}
                  alt={`${account.data.username}'s Logo`}
                />
                {account.data.username}
              </span>
            )}
          </Link>
        </span>

        {user.kind === "user" ? (
          <button
            onClick={logOut}
            className="hover:bg-slate-100 self-stretch px-4"
          >
            Вийти
          </button>
        ) : (
          <button className="hover:bg-green-100 self-stretch px-4">
            <Link to="/login" className="h-full">
              Увійти
            </Link>
          </button>
        )}
      </nav>
    </header>
  );
};
