import styled from "../css/ShowInfo.module.css";
import MyContent from "./MyContent.js";
import { getCookie } from './Nav';
import { useState } from "react";

const token = getCookie("token");

// function getContent(e) {
//   console.log(e.target.innerText);
//   <MyContent />
// }

function ShowInfo(props) {
  const [contents,setContent]=useState(null);
  const clickContent =(e) => {
    setContent(e.target.innerText);
  }
  console.log(props.id);
  return (
    <div className={styled.info_container}>
      <ul className={styled.info_ul}>
        <li className={styled.info_li}>{props.id}</li>
        <li 
          className={styled.info_li} 
          onClick={clickContent}
          value ="question">
          my question
        </li>
        <li className={styled.info_li}>닉네임</li>
        <li 
          className={styled.info_li} 
          onClick={clickContent}
          value ="answer">
          my answer
        </li>
        <li 
          className={styled.info_li} 
          onClick={clickContent}
          value="message">
          쪽지
        </li>
        <li 
          className={styled.info_li} 
          onClick={clickContent}
          value="solution">
          my solution
        </li>
      </ul>
      <MyContent
        content = {contents}
        /> 
    </div>
  );
}

export default ShowInfo;
