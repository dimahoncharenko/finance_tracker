// Imports main functionality
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Imports components
import { Navbar } from "./components/Navbar";

// Imports pages
import { Index } from "./routes";
import { User } from "./routes/User";
import { Login } from "./routes/Login";
import { Register } from "./routes/Register";

// Imports additional functionality
import { AuthProvider } from "./utils";

function App() {
  return (
    <Router>
      <AuthProvider>
        <Navbar />
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/user" element={<User />} />
          <Route path="/" element={<Index />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
