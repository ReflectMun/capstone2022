import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import Home from "./routes/Home";
import Login from "./routes/Login";
import Signup from "./routes/Signup";
import Post from "./components/Post";
import React from "react";
import Info from "./routes/Info";

//쿠키 읽기
function getCookie(key) {
  key = new RegExp(key + "=([^;]*)"); // 쿠키들을 세미콘론으로 구분하는 정규표현식 정의
  return key.test(document.cookie) ? unescape(RegExp.$1) : ""; // 인자로 받은 키에 해당하는 키가 있으면 값을 반환
}
//쿠키 체크 - 있으면 true 없으면 false
function boolCheckCookie(key) {
  return getCookie(key) != "" ? true : false;
}

function App() {
  const [isLogin, setIsLogin] = useState(false);
  const [loginId, setLoginId] = useState("");
  //로그인 아이디로 쿠키 읽어와서, 쿠키 만료안되고 있으면 로그인상태 true
  useEffect(() => {
    if (boolCheckCookie(loginId)) {
      //쿠키 있으면
      setIsLogin(true);
    } else {
      //없으면
      setIsLogin(false);
    }
  });
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <Home
              loginValue={isLogin}
              setIsLogin={setIsLogin}
              loginId={loginId}
            />
          }
        />
        <Route
          path="/login"
          element={
            <Login
              loginValue={isLogin}
              setIsLogin={setIsLogin}
              setLoginId={setLoginId}
            />
          }
        />
        <Route path="/signup" element={<Signup />} />
        <Route path="/answer" element={<Post />} />
        <Route path="/account" element={<Info />} />
      </Routes>
    </Router>
  );
}
export default App;
