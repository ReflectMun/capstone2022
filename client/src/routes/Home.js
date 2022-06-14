import Message from "../components/Message";
import Nav from "../components/Nav";
import Mainarea from "../components/Mainarea";
import styles from "../css/Home.module.css";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

function getCookie(key) {
  key = new RegExp(key + "=([^;]*)"); // 쿠키들을 세미콘론으로 구분하는 정규표현식 정의
  return key.test(document.cookie) ? unescape(RegExp.$1) : ""; // 인자로 받은 키에 해당하는 키가 있으면 값을 반환
}
function boolCheckCookie(key) {
  return getCookie(key) != "" ? true : false;
}
function Home(props) {
  const [selectedMajor, setSelectedMajor] = useState("");
  const [isLogin, setIsLogin] = useState(false);
  useEffect(() => {
    if (boolCheckCookie("token")) {
      setIsLogin(true);
    } else {
      setIsLogin(false);
    }
  }, []);
  return (
    <div>
      <Nav setSelectedMajor={setSelectedMajor} />
      {isLogin ? (
        selectedMajor === "" ? null : (
          <Mainarea
            selectedMajor={selectedMajor}
            setBoardURI={props.setBoardURI}
          />
        )
      ) : (
        <div className={styles.container}>
          <div className={styles.logoContainer}>
            <span>SAVIOR</span>
          </div>
          <div>
            <div className={styles.actionContainer}>
              <p id={styles.ment}>로그인 후 서비스를 이용할 수 있습니다</p>
              <Link
                to={"/login"}
                style={{
                  textDecoration: "none",
                  color: "inherit",
                  margin: "0px 0px",
                }}
              >
                <span id={styles.id}>로그인</span>
              </Link>
              <div>
                <Link
                  to={"/signup"}
                  style={{
                    textDecoration: "none",
                    color: "inherit",
                    margin: "0px 0px",
                  }}
                >
                  <span id={styles.sign}>회원가입</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
      <Message />
    </div>
  );
}
export default Home;
