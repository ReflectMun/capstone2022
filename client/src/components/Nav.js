import { Link } from "react-router-dom";
import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import styled from "../css/nav.module.css";
import Info from "../routes/Info.js";
import Major from "./Major.js";
import logoImage from "../img/logo_savior.png";
import jwt_decode from "jwt-decode";

const API_URL = "http://www.qnasavior.kro.kr";
const LOGOUT_API = "api/logout";
const point_api = "api/point";
//쿠키 읽기 + 이 함수 형제 컴포넌트에서 쓸라면 export 쓰라길래 썼음.
export function getCookie(key) {
  key = new RegExp(key + "=([^;]*)"); // 쿠키들을 세미콘론으로 구분하는 정규표현식 정의
  return key.test(document.cookie) ? unescape(RegExp.$1) : ""; // 인자로 받은 키에 해당하는 키가 있으면 값을 반환
}

//쿠키 체크 - 있으면 true 없으면 false
//getCookie() 에 의존
function boolCheckCookie(key) {
  return getCookie(key) != "" ? true : false;
}

//쿠키 삭제
//쿠키는 삭제가 없어서 현재 시각으로 만료 처리를 함.
function delCookie(key) {
  let todayDate = new Date();
  document.cookie = key + "=; path=/; expires=" + todayDate.toGMTString() + ";"; // 현재 시각 이전이면 쿠키가 만료되어 사라짐.
}

function LoginText() {
  return (
    <div>
      <li id={styled.login}>
        <Link
          to={"/login"}
          style={{ textDecoration: "none", color: "inherit" }}
        >
          로그인
        </Link>
      </li>
    </div>
  );
}

function LogoutText() {
  function onClickLogout(event) {
    event.preventDefault();
    const token = getCookie("token");
    if (token === "") {
      //에러 처리
      console.log(token);
      console.log("cookie에 token 없음, 로그아웃 상태");
    } else {
      //로그아웃 처리
      return new Promise((resolve, reject) => {
        fetch(`${API_URL}/${LOGOUT_API}`, {
          method: "GET",
          headers: {
            authorization: token,
          },
        })
          .then((response) => response.json())
          .then((result) => {
            console.log(result);
            if (result.code === 203) {
              console.log(result);
              alert("로그아웃");
              delCookie("token");
              window.location.replace("/");
            }
          })
          .catch((error) => {
            console.log(error);
            resolve({
              code: 4403,
              message: "로그아웃 중 서버에서 오류가 발생하였습니다",
            });
          });
      });
    }
  }
  return (
    <div>
      <li
        id={styled.login}
        style={{ cursor: "pointer" }}
        onClick={onClickLogout}
      >
        로그아웃
      </li>
    </div>
  );
}

//포인트
function GetPoint() {
  const token = getCookie("token");
  console.log(token);
  const [point, setPoint] = useState(0);
  new Promise((resolve, reject) => {
    fetch(`${API_URL}/${point_api}`, {
      method: "GET",
      headers: { authorization: token },
    })
      .then((result) => {
        if (result.code === 240) {
          console.log(result.code);
          setPoint(result.point);
          console.log(point);
        }
      })
      .catch((error) => {
        console.log(error);
      });
    return (
      <div>
        <li id={styled.point}>{point}</li>
      </div>
    );
  });
}

function Nav(props) {
  const [selectCollege, setSelectCollge] = useState("공학");
  const [point, setPoint] = useState(0);
  const onChangeCollge = (event) => {
    setSelectCollge(event.target.innerText);
  };
  const colleges = ["공학", "인문", "자연", "사회", "의약", "예체능"];
  //로그아웃할때 필요한 token cookie 가져오기
  const [isLogin, setIsLogin] = useState(false);
  const [navId, setNavId] = useState("계정");

  function getPoint() {
    const token = getCookie("token");
    new Promise((resolve, reject) => {
      fetch(`${API_URL}/${point_api}`, {
        method: "GET",
        headers: { authorization: token },
      })
        .then((response) => response.json())
        .then((result) => {
          console.log("point:" + result.point);
          if (result.code === 240) {
            // console.log(result.code);
            setPoint(result.point);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    });
  }
  useEffect(() => {
    if (boolCheckCookie("token")) {
      setIsLogin(true);
      //토큰 가져와서 디코드하고 data 사용
      const token = getCookie("token");
      const accountData = jwt_decode(token);
      setNavId(accountData.Account);
      getPoint();
    } else {
      setIsLogin(false);
    }
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
          <Major
            college={selectCollege}
            setSelectedMajor={props.setSelectedMajor}
          />
        </ul>
      </div>
      <div className={styled.logoContainer}>
       <Link to ={"/"}>
          <img src={logoImage} id={styled.logo_image} alt="savior" />
        </Link>
      </div>
      <div className={styled.info}>
        <ul id={styled.info}>
          <li id={styled.id}>
            <Link
              to={"/account"}
              style={{ textDecoration: "none", color: "inherit" }}
            >
              {isLogin ? navId : "계정"}
            </Link>
          </li>
          {/* 로그인 했을 때 포인트 숫자 보이게 아니면 point 글자만 보이게 */}
          {/* {isLogin ? <GetPoint /> : <li id={styled.point}>POINT</li>} */}

          {isLogin ? (
            <li id={styled.point}>{point}</li>
          ) : (
            <li id={styled.point}>POINT</li>
          )}
          <li id={styled.message}>
            <Link
                to={"/account"}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                쪽지
              </Link>
          </li>
          {
            //로그인상태 값이 false 이면 로그인 컴포넌트, true 면 로그아웃 컴포넌트
            isLogin ? <LogoutText /> : <LoginText />
          }
        </ul>
      </div>
    </nav>
  );
}

export default Nav;
