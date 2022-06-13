import styled from "../css/ShowInfo.module.css";
import MyContent from "./MyContent.js";
import { getCookie } from "./Nav";
import { useState } from "react";
import jwt_decode from "jwt-decode";

function ShowInfo(props) {
  const token = getCookie("token");
  const accountData = jwt_decode(token);
  console.log(accountData);
  const [contents, setContent] = useState(null);
  const clickContent = (e) => {
    setContent(e.target.innerText);
  };
  return (
    <div className={styled.info_container}>
      <ul className={styled.info_ul}>
        <li className={styled.info_li}>
          <span>{accountData.Account}</span>
        </li>
        <li className={styled.info_li} onClick={clickContent} value="question">
          my question
        </li>
        <li className={styled.info_li}>
          <span>{accountData.Nickname}</span>
        </li>
        <li className={styled.info_li} onClick={clickContent} value="answer">
          my answer
        </li>
        <li className={styled.info_li} onClick={clickContent} value="message">
          쪽지
        </li>
        <li className={styled.info_li} onClick={clickContent} value="solution">
          my solution
        </li>
      </ul>
      <div>
        <MyContent content={contents} />
      </div>
    </div>
  );
}

export default ShowInfo;
