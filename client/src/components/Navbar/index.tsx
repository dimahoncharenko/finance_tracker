// Imports main functionality
import { useContext } from "react";
import { Link } from "react-router-dom";

// Imports styling utils
import vision from "../../images/vision.png";

// Imports additional functionality
import { GlobalContext } from "../../context";

export const Navbar = () => {
  const token = localStorage.getItem("token");
  const { user, dispatch } = useContext(GlobalContext);

  const logOut = () => {
    localStorage.removeItem("token");
    dispatch({ type: "LOGOUT_USER" });
    dispatch({ type: "INIT_TRANSACTIONS", payload: [] });
  };

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
          Привіт,{" "}
          <Link to="/user" className="cursor-pointer font-bold text-sky-300">
            {token ? (
              <span className="min-w-max flex gap-1 items-center">
                <img
                  className="w-6 h-6 object-cover rounded-full"
                  src={user.avatar}
                  alt={`${user.username}'s Logo`}
                />
                {user.username}
              </span>
            ) : (
              <span className="min-w-max flex gap-1 items-center justify-center">
                <img
                  className="w-6 h-6 object-cover rounded-full"
                  src={user.avatar}
                  alt={"Guest's Logo"}
                />
                Гість
              </span>
            )}
          </Link>{" "}
          <br />
          {token ? null : (
            <span className="text-xs text-slate-500">
              (Псс.. Для збереження транзакцій, потрібно увійти в систему)
            </span>
          )}
        </span>

        {token ? (
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
