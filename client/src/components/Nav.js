import React, { useState } from "react";
import PropTypes from "prop-types";
import styled from "../css/nav.module.css";
import Info from "../routes/Info.js";
import Major from "./Major.js";
function Nav() {
  const [selectCollege, setSelectCollge] = useState("공학");
  const onChangeCollge = (event) => {
    setSelectCollge(event.target.innerText);
  };
  const colleges = ["공학", "인문", "자연", "사회", "의약", "예체능"];
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
        <span id={styled.logo}>SAVIOR</span>
      </div>
      <div className={styled.info}>
        <ul id={styled.info}>
          <li id={styled.id} onClick={Info}>
            id
          </li>
          <li id={styled.point}>point</li>
          <li id={styled.message}>쪽지</li>
          <li id={styled.login}>로그인/로그아웃</li>
        </ul>
      </div>
    </nav>
  );
}

export default Nav;
