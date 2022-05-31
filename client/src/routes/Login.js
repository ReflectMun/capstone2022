import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import styles from "../css/Login.module.css";
import logoImage from "../img/logo_savior.png";

//쿠키 저장
//days 는 일자 정수 - 365년 1년 쿠키
function setCookie(key, value, days) {
  let todayDate = new Date();
  todayDate.setDate(todayDate.getDate() + days); // 현재 시각 + 일 단위로 쿠키 만료 날짜 변경
  //todayDate.setTime(todayDate.getTime() + (days * 24 * 60 * 60 * 1000)); // 밀리세컨드 단위로 쿠키 만료 날짜 변경
  document.cookie =
    key +
    "=" +
    escape(value) +
    "; path=/; expires=" +
    todayDate.toGMTString() +
    ";";
}

// 쿠키 읽기
function getCookie(key) {
  key = new RegExp(key + "=([^;]*)"); // 쿠키들을 세미콘론으로 구분하는 정규표현식 정의
  return key.test(document.cookie) ? unescape(RegExp.$1) : ""; // 인자로 받은 키에 해당하는 키가 있으면 값을 반환
}

//쿠키 삭제
//쿠키는 삭제가 없어서 현재 시각으로 만료 처리를 함.
function delCookie(key) {
  let todayDate = new Date();
  document.cookie = key + "=; path=/; expires=" + todayDate.toGMTString() + ";"; // 현재 시각 이전이면 쿠키가 만료되어 사라짐.
}

//쿠키 체크 - 있으면 true 없으면 false
//getCookie() 에 의존
function boolCheckCookie(key) {
  return getCookie(key) != "" ? true : false;
}

const API_URL = "http://www.qnasavior.kro.kr";
const LOGIN_API = "api/login";

function Login(props) {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const onIdChange = (event) => {
    setId(event.target.value);
  };
  const onPwChange = (event) => {
    setPassword(event.target.value);
  };
  function setIsLogin(loginValue) {
    props.setIsLogin(loginValue);
  }
  //버튼클릭, 로그인 이벤트
  const onClickLogin = (event) => {
    event.preventDefault();
    if (id === "" || password === "") {
      alert("ID와 비밀번호를 입력해주세요");
      return;
    } else {
      return new Promise((resolve, reject) => {
        fetch(`${API_URL}/${LOGIN_API}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            authorization: null,
          },
          body: JSON.stringify({ ID: id, Password: password }),
        })
          .then((res) => res.json())
          .then((data) => {
            //토큰 있으면 cookie에 저장
            if (data.token != "") {
              setCookie("token", data.token, 1);
              alert("로그인 완료");
              navigate("/");
            } else if (data.code == 300) {
              alert("계정 혹은 비밀번호가 틀렸습니다");
              resolve({
                code: 300,
                message: "계정 혹은 비밀번호가 틀렸습니다",
              });
            } else if (data.code == 151) {
              alert("올바르지 않은 데이터 형식이 전송되었습니다");
              resolve({
                code: 151,
                message: "올바르지 않은 데이터 형식이 전송되었습니다",
              });
            } else if (data.code == 150) {
              alert("로그인을 위해 DB 조회중 오류가 발생하였습니다");
              resolve({
                code: 150,
                message: "로그인을 위해 DB 조회중 오류가 발생하였습니다",
              });
            } else if (data.code == 351) {
              alert("계정정보가 누락되었습니다");
              resolve({ code: 351, message: "계정정보가 누락되었습니다" });
            } else if (data.code == 3802) {
              alert(
                "사용자 인증 토큰 발급을 위해 DB와 통신하던 중 오류가 발생했습니다"
              );
              resolve({
                code: 3802,
                message:
                  "사용자 인증 토큰 발급을 위해 DB와 통신하던 중 오류가 발생했습니다",
              });
            }
          })
          .catch((error) => {
            console.log(error);
          });
      });
    }
  };
  return (
    <div className={styles.background}>
      <div className={styles.main}>
        <header>
          <img src={logoImage} className={styles.logo_image} alt="error" />
        </header>
        <section>
          <form name="loginForm" method="post">
            <div className={styles.input_wrap}>
              <input
                value={id}
                name="login"
                type="text"
                className={styles.input_info}
                placeholder="아이디"
                onChange={onIdChange}
              />
            </div>
            <div className={styles.input_wrap}>
              <input
                value={password}
                name="passwordBox"
                type="password"
                className={styles.input_info}
                placeholder="비밀번호"
                onChange={onPwChange}
              />
            </div>
            <div className={styles.login_btn_wrap}>
              <input
                type="submit"
                onClick={onClickLogin}
                className={styles.login_btn}
                value="로그인"
              />
            </div>
          </form>
          <div className={styles.sign_up}>
            <Link
              to={"/signup"}
              style={{ textDecoration: "none", color: "inherit" }}
            >
              회원가입
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
export default Login;
