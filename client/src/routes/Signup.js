import { func } from "prop-types";
import { useState } from "react";
import styles from "../css/Signup.module.css";
import logoImage from "../img/logo_savior.png";

const serverURL = "http://www.qnasavior.kro.kr";
const signin_api = "api/signin";

function onClickEmailBtn(event) {
  event.preventDefault();
}

function onClickSignupBtn(e) {
  e.preventDefault();
  //회원가입 텍스트 박스
  const formElement = document.SignUpForm;
  const id = formElement.id.value;
  const password = formElement.password.value;
  const passwordCheck = formElement.passwordCheck.value;
  const nickname = formElement.nickname.value;
  const email = formElement.email.value;
  const reqBody = {
    Account: id,
    Password: password,
    Nickname: nickname,
    EMail: email,
  };
  //회원가입 요청
  fetch(`${serverURL}/${signin_api}`, {
    method: "post",
    body: JSON.stringify(reqBody),
    headers: { "Content-Type": "application/json" },
  })
    .then((response) => response.json())
    .then((result) => {
      result.code === 204
        ? alert("🎉회원가입 성공🎉")
        : alert("😥" + result.message + "😥");
    });
}
function Signup() {
  const [pw, setPw] = useState("");
  const [pwc, setPwc] = useState("");
  const [isPasswordConfirm, setIsPasswordConfirm] = useState(false)
  const [passwordConfirmMessage, setPasswordConfirmMessage] = useState('');
  const PasswordHandler = (e) => {
    setPw(e.target.value);
    console.log(pw);
  };
  const onChangePasswordConfirm = (e) => {
      const passwordConfirmCurrent = e.target.value;
      setPwc(passwordConfirmCurrent);

      if (pw === passwordConfirmCurrent) {
        setPasswordConfirmMessage('비밀번호가 일치합니다🙆‍♂️')
        setIsPasswordConfirm(true)
      } else {
        setPasswordConfirmMessage('비밀번호가 일치하지 않습니다🙅‍♂️')
        setIsPasswordConfirm(false)
      }
    //[pw]
};
  return (
    <div className={styles.background}>
      <div className={styles.signup_main}>
        <header>
          <img src={logoImage} className={styles.logo_image} alt="error" />
        </header>
        <form name="SignUpForm" method="post">
          <div>
            <h4>아이디</h4>
            <div className={styles.signup_input}>
              <input name="id" 
              type="text" 
              className={styles.signup_info}
              placeholder="아이디를 입력해주세요." />
            </div>
            <h4>닉네임</h4>
            <div className={styles.signup_input}>
              <input
                name="nickname"
                type="text"
                className={styles.signup_info}
                placeholder="16자 이내여야 합니다."
              />
            </div>
            <h4>비밀번호</h4>
            <div className={styles.signup_input}>
              <input
                name="password"
                type="text"
                placeholder="대문자, 숫자, 특수문자가 모두 하나 이상을 포함해야 합니다."
                className={styles.signup_info}
                onChange={PasswordHandler}
              />
            </div>
            <h4>비밀번호 확인</h4>
            <div className={styles.signup_input}>
              <input
                name="passwordCheck"
                type="text"
                className={styles.signup_info}
                onChange={onChangePasswordConfirm}
                placeholder="비밀번호 확인이 필요합니다."
              />
            </div>
            {(pwc.length > 0 && isPasswordConfirm) ? <span>{passwordConfirmMessage}</span> : <span>{passwordConfirmMessage}</span> }
          </div>
          <h4>이메일 인증</h4>
          <div className={styles.wrap_email} id ={styles.wrap_email}>
            <div className={styles.signup_input}>
              <input
                name="email"
                type="text"
                placeholder="ac.kr로 끝나는 형식이어야 합니다."
                className={styles.signup_info}
              />
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
              disabled={!(isPasswordConfirm)}
            />
          </div>
        </form>
      </div>
    </div>
  );
}
export default Signup;
