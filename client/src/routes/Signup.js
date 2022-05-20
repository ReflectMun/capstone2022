import styles from "../css/Signup.module.css";
import logoImage from "../img/logo_savior.png";

function onClickEmailBtn(event) {
  event.preventDefault();
}
function onClickSignupBtn(event) {
  event.preventDefault();
}
function Signup() {
  const GoSignup = (e) => {
    const serverURL = "www.qnasavior.kro.kr:14450";
    const reqBody = {
      Account: e.target.value.ID,
      Password: e.target.value.password,
      Nickname: e.target.value.nickname,
      EMail: e.target.value.EMail,
    };
    fetch(serverURL + "/api/signin", {
      method: "post",
      body: JSON.stringify(reqBody),
      headers: { "Content-Type": "application/json" },
    })
      .then((response) => response.json())
      .then((result) => {
        result.message === "success"
          ? alert("회원가입 성공")
          : alert("회원가입 실패");
      });
  };

  return (
    <div className={styles.background}>
      <div className={styles.signup_main}>
        <header>
          <img src={logoImage} className={styles.logo_image} alt="error" />
        </header>
        <form action="" method="post">
          <div>
            <h4>아이디</h4>
            <div className={styles.signup_input}>
              <input type="text" className={styles.signup_info} />
            </div>
            <h4>닉네임</h4>
            <div className={styles.signup_input}>
              <input type="text" className={styles.signup_info} />
            </div>
            <h4>비밀번호</h4>
            <div className={styles.signup_input}>
              <input type="text" className={styles.signup_info} />
            </div>
            <h4>비밀번호 확인</h4>
            <div className={styles.signup_input}>
              <input type="text" className={styles.signup_info} />
            </div>
          </div>
          <h4>이메일 인증</h4>
          <div className={styles.wrap_email}>
            <div className={styles.signup_input}>
              <input type="text" className={styles.signup_info} />
            </div>
            <div className={styles.mail_btn_wrap}>
              <button className={styles.mail_btn} onClick={onClickEmailBtn}>
                인증
              </button>
            </div>
          </div>
          <div className={styles.signup_btn_wrap}>
            <input
              type="submit"
              name="signup_btn"
              value="가입"
              className={styles.signup_btn}
              onClick={onClickSignupBtn}
            />
          </div>
          <div className={styles.signup_btn_wrap}>
            <input
              type="submit"
              name="signup_btn"
              value="가입"
              className={styles.signup_btn}
              onClick={GoSignup()}
            />
          </div>
        </form>
      </div>
    </div>
  );
}
export default Signup;
