import { Link } from "react-router-dom";
import styles from "./Login.module.css";
import logoImage from "../img/logo_savior.png";
function Login() {
  return (
    <div className={styles.main}>
      <header>
        <img src={logoImage} className={styles.logo_image} alt="error" />
      </header>
      <section>
        <form method="post">
          <div className={styles.input_wrap}>
            <input
              type="text"
              className={styles.input_info}
              placeholder="아이디"
            />
          </div>
          <div className={styles.input_wrap}>
            <input
              type="password"
              className={styles.input_info}
              placeholder="비밀번호"
            />
          </div>
          <div className={styles.login_btn_wrap}>
            <input type="submit" class={styles.login_btn} value="로그인" />
          </div>
        </form>
        <div className={styles.sign_up}>
          <Link to={"/signup"} style={{ textDecoration: "none" }}>
            회원가입
          </Link>
        </div>
      </section>
    </div>
  );
}
export default Login;
