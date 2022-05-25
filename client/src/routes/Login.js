import { Link } from "react-router-dom";
import { useState } from "react";
import styles from "../css/Login.module.css";
import logoImage from "../img/logo_savior.png";
// function onClick(event) {
//   event.preventDefault();
//   const formElement = document.loginForm;

//   const Account = formElement.login.value;
//   const Password = formElement.passwordBox.value;

//   if (!Account || !Password) {
//     alert("ID와 비밀번호를 입력해주세요");
//   } else {
//     fetch("URL", {
//       method: "POST",
//       headers: {
//         "Content-Type": 'application/json; encode="utf8"',
//         authorization: readCookie("token"),
//       },
//       body: JSON.stringify({ ID: Account, Password: Password }),
//     })
//       .then((rawData) => rawData.json())
//       .then((data) => {
//         data["token"];
//       });
//   }
// }
const API_URL = "http://www.qnasavior.kro.kr";
const LOGIN_API = "api/login";

function Login() {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const onIdChange = (event) => {
    setId(event.target.value);
  };
  const onPwChange = (event) => {
    setPassword(event.target.value);
  };
  //버튼클릭, 로그인 이벤트
  const onClickLogin = (event) => {
    event.preventDefault();
    if (id === "" || password === "") {
      alert("ID와 비밀번호를 입력해주세요");
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
            console.log(data);
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
