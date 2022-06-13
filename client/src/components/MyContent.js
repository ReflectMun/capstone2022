import { useEffect, useState } from "react";
import styled from "../css/MyContent.module.css";
import { getCookie } from "./Nav";

const API_URL = "http://www.qnasavior.kro.kr";
const Receive = "api/message/fetch/received";
const Send = "api/message/fetch/sended";
const token = getCookie("token");

function MyContent(props) {
 //const content = props.content;
 let p = 0;
 const pageNum= p.toString();

 /////////////수신쪽지가져오기/////////////////////
 const [isR_Message, setIsR_Message] = useState(false);
 const [r_messages,setr_Messages] = useState([]);
 function getR_Messages(){
  new Promise((resolve, reject) => {
    fetch(`${API_URL}/${Receive}?pageNum=${pageNum}`, {
      method: "GET",
      headers: { 
        authorization: token 
      },
    })
      .then((response) => response.json())
      .then((result) => {
        if ((result.code === 216)) {
          setIsR_Message(true);
          setr_Messages(result.list);
        }
        else if ((result.code === 217)) {
          setIsR_Message(false);
        }
      });
  });
 }

const pageR_MessageList = r_messages.map((item)=>(
  <li className ={styled.message}key = {item.Author}>
    <p id ={styled.author}>{item.Author}</p>
    <p id ={styled.content}>{item.Content}</p>
    <p id ={styled.date}>{item.Date.slice(0, 10)}</p>
    <p id ={styled.time}>{item.Time.slice(0, 8)}</p>
  </li>
))
////////////////////발신쪽지 가져오기/////////////////
const [isS_Message, setIsS_Message] = useState(false);
const [s_messages,sets_Messages] = useState([]);
function getS_Messages(){
  new Promise((resolve, reject) => {
    fetch(`${API_URL}/${Send}?pageNum=${pageNum}`, {
      method: "GET",
      headers: { 
        authorization: token 
      },
    })
      .then((response) => response.json())
      .then((result) => {
        if ((result.code === 214)) {
          setIsS_Message(true);
          sets_Messages(result.list);
        }
        else if ((result.code === 215)) {
          setIsS_Message(false);
        }
      });
  });
}
const pageS_MessageList = s_messages.map((item)=>(
  <li className ={styled.message}key = {item.Author}>
    <p id ={styled.author}>{item.Recipient}</p>
    <p id ={styled.content}>{item.Content}</p>
    <p id ={styled.date}>{item.Date.slice(0, 10)}</p>
    <p id ={styled.time}>{item.Time.slice(0, 8)}</p>
  </li>
))

useEffect(() => {
  getR_Messages();
  getS_Messages();
}, []);

    return (
      <div className={styled.messageContainer}>
        <div>
        {isS_Message ?(
          <div>
            <div className={styled.container}>
            <p id ={styled.header}>발신</p>
            <ul className={styled.messages}>
            <li className ={styled.message}>
              <p id ={styled.author}>받은 사람</p>
              <p id ={styled.content}>내용</p>
              <p id ={styled.date}>보낸 날짜</p>
              <p id ={styled.time}>보낸 시간</p>
            </li>
              {pageS_MessageList}
            </ul>
          </div>
          </div>
        ):(
          <div>
            <span>✉보낸 메세지가 없어요✉</span>
          </div>
        )}
        </div>
        <span id ={styled.ho}></span>
        <div>
        {isR_Message ? (
          <div className={styled.container}>
            <p id ={styled.header}>수신</p>
            <ul className={styled.messages}>
            <li className ={styled.message}>
              <p id ={styled.author}>보낸 사람</p>
              <p id ={styled.content}>내용</p>
              <p id ={styled.date}>보낸 날짜</p>
              <p id ={styled.time}>보낸 시간</p>
            </li>
              {pageR_MessageList}
            </ul>
          </div>
        ):(
          <div className={styled.container}>
            <span>✉받은 메세지가 없어요✉</span>
          </div>
        )}
      </div>
      </div>
    );
  }
export default MyContent;