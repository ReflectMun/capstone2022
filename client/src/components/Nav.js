import { Link } from "react-router-dom";
import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import styled from "../css/nav.module.css";
import Info from "../routes/Info.js";
import Major from "./Major.js";
import logoImage from "../img/logo_savior.png";

function Nav(props) {
  const [selectCollege, setSelectCollge] = useState("공학");
  const [login, setLogin] = useState("");
  const onChangeCollge = (event) => {
    setSelectCollge(event.target.innerText);
  };
  const colleges = ["공학", "인문", "자연", "사회", "의약", "예체능"];
  // login state check
  function loginCheck() {
    if (props.loginValue === false) {
      //로그인 안되어 있으면 '로그인'으로 출력
      setLogin("로그인");
    } else {
      setLogin("로그아웃"); //로그인 되어있는 상태면, '로그아웃'으로 출력
    }
  }
  useEffect(() => {
    loginCheck();
  }, []);
  return (
    <nav className={styled.nav}>
      <div className={styled.menuToggle}>
        <input type="checkbox" />
        <span></span>
        <span></span>
        <span></span>
        <ul className={styled.menu}>
          <ul id={styled.college}>
            {colleges.map((college) => (
              <li key={college} onClick={onChangeCollge}>
                {college}
              </li>
            ))}
          </ul>
          <Major college={selectCollege} />
        </ul>
      </div>
      <div className={styled.logoContainer}>
        <img src={logoImage} id={styled.logo_image} alt="savior" />
      </div>
      <div className={styled.info}>
        <ul id={styled.info}>
          <li id={styled.id} onClick={Info}>
            ACCOUNT
          </li>
          <li id={styled.point}>POINT</li>
          <li id={styled.message}>쪽지</li>
          <li id={styled.login}>
            <Link
              to={"/login"}
              style={{ textDecoration: "none", color: "inherit" }}
            >
              {login}
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Nav;
