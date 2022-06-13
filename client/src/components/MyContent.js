import { useEffect, useState } from "react";
import styled from "../css/MyContent.module.css";
import { getCookie } from "./Nav";

const API_URL = "http://www.qnasavior.kro.kr";
const Receive = "api/message/fetch/received";
const token = getCookie("token");



function MyContent(props) {
 //const content = props.content;

 //쪽지

 let p = 0;
 const pageNum= p.toString();
 //console.log(typeof pageNum);
 const [isMessage, setIsMessage] = useState(false);
 const [messages,setMessages] = useState([]);

 function getMessages(){
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
          console.log(result.code);
          setIsMessage(true);
          setMessages(result.list);
          console.log(result);
        }
        else if ((result.code === 217)) {
          console.log(result.code);
          setIsMessage(false);
        }
      });
  });
 }
 
useEffect(() => {
  getMessages();
}, []);

// const pageMessageList = messages.map((item)=>(
//   <li key = {item.Author}>
//     <p>{item.Author}</p>
//     <p>{item.Content}</p>
//     <p>{item.Date}</p>
//     <p>{item.Time}</p>
//   </li>
// ))

    return (
      isMessage ? (
        <div>
          <ul>
            {/* {pageMessageList} */}
          </ul>
        </div>
      ):(
        <div>
          <span>없음</span>
        </div>
      )
      
    );
  }
export default MyContent;