import styled from "../css/ShowInfo.module.css";
import MyMessage from "./MyMessage.js";
import { getCookie } from './Nav';
import { useState } from "react";
import jwt_decode from "jwt-decode";

function ShowInfo(props) {
  const token = getCookie("token");
  const accountData = jwt_decode(token);
  const [contents,setContent]=useState(null);

  const clickContent =(e) => {
    setContent(e.target.innerText);
  }
  return (
    <div className={styled.info_container}>
      <ul className={styled.info_ul}>
        <li
          className={styled.info_li}>
          <span>ID : </span>
          <span>{accountData.Account}</span>
          </li>
        <li
          style={{cursor:"pointer"}}  
          name = "question" 
          className={styled.info_li} 
          onClick={clickContent}
          value ="question">
          my question
        </li>
        <li
          className={styled.info_li}>
        <span>닉네임 : </span>
        <span>{accountData.Nickname}</span>
          </li>
        <li 
          style={{cursor:"pointer"}} 
          name="answer"
          className={styled.info_li} 
          onClick={clickContent}
          value ="answer">
          my answer
        </li>
        <li
          style={{cursor:"pointer"}} 
          name="message"
          className={styled.info_li} 
          onClick={clickContent}
          value="message">
          쪽지
        </li>
        <li 
          style={{cursor:"pointer"}} 
          name="solution"
          className={styled.info_li} 
          onClick={clickContent}
          value="solution">
          my solution
        </li>
      </ul>
      <div>
        {(contents)==="쪽지"? (<MyMessage />):(null)}
    </div>
    </div>
  );

}

export default ShowInfo;
