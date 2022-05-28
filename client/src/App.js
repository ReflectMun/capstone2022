import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState } from "react";
import Home from "./routes/Home";
import Login from "./routes/Login";
import Signup from "./routes/Signup";
import Post from "./components/Post";
import React from "react";

function App() {
  const [isLogin, setIsLogin] = useState(false);
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={<Home loginValue={isLogin} setIsLogin={setIsLogin} />}
        />
        <Route
          path="/login"
          element={<Login loginValue={isLogin} setIsLogin={setIsLogin} />}
        />
        <Route path="/signup" element={<Signup />} />
        <Route path="/answer" element={<Post />} />
      </Routes>
    </Router>
  );
}
export default App;
