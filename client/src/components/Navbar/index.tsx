// Imports main functionality
import { Link } from "react-router-dom";

// Imports styling utils
import vision from "../../images/vision.png";

export const Navbar = () => {
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
            Гість
          </Link>{" "}
          <br />
          {false ? null : (
            <span className="text-xs text-slate-500">
              (Псс.. Для збереження транзакцій, потрібно увійти в систему)
            </span>
          )}
        </span>

        {false ? (
          <button className="hover:bg-slate-100 self-stretch px-4">
            Вийти
          </button>
        ) : (
          <button className="hover:bg-green-100 self-stretch px-4">
            Увійти
          </button>
        )}
      </nav>
    </header>
  );
};
