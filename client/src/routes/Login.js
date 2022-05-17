import { Link } from "react-router-dom";
import styles from "./Login.module.css";
import logoImage from "../img/logo_savior.png";
function onClick(event) {
  event.preventDefault();
  // const formElement = document.loginForm;

  // const Account = formElement.login.value;
  // const Password = formElement.passwordBox.value;

  // if (!Account || !Password) {
  //   alert("ID와 비밀번호를 입력해주세요");
  // } else {
  //   fetch("URL", {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": 'application/json; encode="utf8"',
  //       authorization: readCookie("token"),
  //     },
  //     body: JSON.stringify({ ID: Account, Password: Password }),
  //   })
  //     .then((rawData) => rawData.json())
  //     .then((data) => {
  //       data["token"];
  //     });
  // }
}

function Login() {
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
                name="login"
                type="text"
                className={styles.input_info}
                placeholder="아이디"
              />
            </div>
            <div className={styles.input_wrap}>
              <input
                name="passwordBox"
                type="password"
                className={styles.input_info}
                placeholder="비밀번호"
              />
            </div>
            <div className={styles.login_btn_wrap}>
              <input
                type="submit"
                onClick={onClick}
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
