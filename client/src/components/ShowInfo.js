import styled from "../css/ShowInfo.module.css";
import MyContent from "../components/MyContent.js";
import { getCookie } from './Nav';
import { useState } from "react";

const token = getCookie("token");

function getMyQuestion() {
  console.log("질문");
  return <MyContent />
}
function getMyAnswer() {
  console.log("답");
  return <MyContent />
}
function getMyMessage() {
  console.log("쪽지");
  return <MyContent />
}
function getMySolution() {
  console.log("솔루션");
  return <MyContent />
}

function ShowInfo() {
  return (
    <div className={styled.info_container}>
      <ul className={styled.info_ul}>
        <li className={styled.info_li}>id</li>
        <li 
          className={styled.info_li} 
          onClick={getMyQuestion}
          value ="question">
          my question
        </li>
        <li className={styled.info_li}>닉네임</li>
        <li 
          className={styled.info_li} 
          onClick={getMyAnswer}
          value ="answer">
          my answer
        </li>
        <li 
          className={styled.info_li} 
          onClick={getMyMessage}
          value="message">
          쪽지
        </li>
        <li 
          className={styled.info_li} 
          onClick={getMySolution}
          value="solution">
          my solution
        </li>
      </ul>
    </div>
  );
}

export default ShowInfo;
