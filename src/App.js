import { Routes, Route } from "react-router-dom";
import HomePage from "./components/homePage/homePage";
import Login from "./components/login/login";
import Register from "./components/register/register";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </div>
  );
}

export default App;
