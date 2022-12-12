// Imports main functionality
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Imports additional functionality
import { GlobalProvider } from "./context";

// Imports components
import { Navbar } from "./components/Navbar";

// Imports pages
import { Index } from "./routes";
import { User } from "./routes/User";
import { Login } from "./routes/Login";
import { Register } from "./routes/Register";

function App() {
  return (
    <GlobalProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/user" element={<User />} />
          <Route path="/" element={<Index />} />
        </Routes>
      </Router>
    </GlobalProvider>
  );
}

export default App;
