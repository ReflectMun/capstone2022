import { useNavigate } from "react-router-dom";
import { useState } from "react";
import styles from "../css/Signup.module.css";
import logoImage from "../img/logo_savior.png";

const serverURL = "http://www.qnasavior.kro.kr";
const signup_api = "api/signup";
const email_api = "api/signup/auth/email";
const check_email_api = "api/signup/verify/email";

//이메일 인증 번호 전송
function onClickEmailBtn(e) {
  e.preventDefault();
  //회원가입 텍스트 박스
  const formElement = document.SignUpForm;
  const email = formElement.email.value;
  const reqBody = {
    EMail: email,
  };
  //console.log(email);
  fetch(`${serverURL}/${email_api}`, {
    method: "post",
    body: JSON.stringify(reqBody),
    headers: { "Content-Type": "application/json" },
  })
    .then((response) => response.json())
    .then((result) => {
      if (result.code === 250) {
        alert(result.message);
      }
    });
}
//이메일 인증 번호 확인
function onClickCheckEmailBtn(e) {
  e.preventDefault();
  //회원가입 텍스트 박스
  const formElement = document.SignUpForm;
  const check_email = formElement.check_email.value;
  const reqBody = {
    VerifyCode: check_email,
  };
  console.log(check_email);
  console.log(check_email.length);
  fetch(`${serverURL}/${check_email_api}`, {
    method: "post",
    body: JSON.stringify(reqBody),
    headers: { "Content-Type": "application/json" },
  })
    .then((response) => response.json())
    .then((result) => {
      if (result.code === 251) {
        alert(result.message);
      } else {
        alert(result.message);
      }
    });
}
//회원가입

function Signup() {
  const navigate = useNavigate();
  function onClickSignupBtn(e) {
    e.preventDefault();
    //회원가입 텍스트 박스
    const formElement = document.SignUpForm;
    const id = formElement.id.value;
    const password = formElement.password.value;
    const nickname = formElement.nickname.value;
    const email = formElement.email.value;
    const reqBody = {
      Account: id,
      Password: password,
      Nickname: nickname,
      EMail: email,
    };
    //회원가입 요청
    fetch(`${serverURL}/${signup_api}`, {
      method: "post",
      body: JSON.stringify(reqBody),
      headers: { "Content-Type": "application/json" },
    })
      .then((response) => response.json())
      .then((result) => {
        if(result.code === 204){
          alert("🎉회원가입 성공🎉");
          console.log("ㅇㅇ");
          window.location.replace("/");
        }
        else{
          alert("😥" + result.message + "😥");
        }
          
      });
  }
  const [pw, setPw] = useState("");
  const [pwc, setPwc] = useState("");
  const [isPasswordConfirm, setIsPasswordConfirm] = useState(false);
  const [passwordConfirmMessage, setPasswordConfirmMessage] = useState("");
  const PasswordHandler = (e) => {
    setPw(e.target.value);
  };
  const onChangePasswordConfirm = (e) => {
    const passwordConfirmCurrent = e.target.value;
    setPwc(passwordConfirmCurrent);

    if (pw === passwordConfirmCurrent) {
      setPasswordConfirmMessage("비밀번호가 일치합니다🙆‍♂️");
      setIsPasswordConfirm(true);
    } else {
      setPasswordConfirmMessage("비밀번호가 일치하지 않습니다🙅‍♂️");
      setIsPasswordConfirm(false);
    }
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
              <input
                name="id"
                type="text"
                className={styles.signup_info}
                placeholder="아이디를 입력해주세요."
              />
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
                type="password"
                placeholder="대문자, 숫자, 특수문자가 모두 하나 이상을 포함해야 합니다."
                className={styles.signup_info}
                onChange={PasswordHandler}
              />
            </div>
            <h4>비밀번호 확인</h4>
            <div className={styles.signup_input}>
              <input
                name="passwordCheck"
                type="password"
                className={styles.signup_info}
                onChange={onChangePasswordConfirm}
                placeholder="비밀번호 확인이 필요합니다."
              />
            </div>
            {pwc.length > 0 && isPasswordConfirm ? (
              <span>{passwordConfirmMessage}</span>
            ) : (
              <span>{passwordConfirmMessage}</span>
            )}
          </div>
          <h4>이메일 인증</h4>
          <div className={styles.wrap_email} id={styles.wrap_email}>
            <div className={styles.signup_input} id={styles.email}>
              <input
                name="email"
                type="text"
                placeholder="ac.kr로 끝나는 형식이어야 합니다."
                className={styles.signup_info}
              />
            </div>
            <div className={styles.mail_btn_wrap}>
              <button className={styles.mail_btn} onClick={onClickEmailBtn}>
                인증하기
              </button>
            </div>
          </div>
          <h4>인증번호</h4>
          <div className={styles.wrap_check_email} id={styles.wrap_check_email}>
            <div className={styles.signup_input} id={styles.check_email}>
              <input
                name="check_email"
                type="text"
                placeholder="메일로 전송된 인증번호를 입력해주세요."
                className={styles.signup_info}
              />
            </div>
            <div className={styles.check_email_btn_wrap}>
              <button
                className={styles.check_email_btn}
                onClick={onClickCheckEmailBtn}
              >
                인증완료
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
              disabled={!isPasswordConfirm}
            />
          </div>
        </form>
      </div>
    </div>
  );
}
export default Signup;
