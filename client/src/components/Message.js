import React, { useState } from 'react';
import styled from '../css/message.module.css';
import { getCookie } from './Nav';

const API_URL = "http://www.qnasavior.kro.kr";
const SendMessage_API = "api/message/send";

//메시지 전송
function sendMessage(receiver,content){
    const token = getCookie("token");
    const Receiver = receiver
    const Content = content
   console.log(token)
   console.log(Receiver)
   console.log(Content)
    const reqBody = {
        Recipient: Receiver,
        Content: Content,
      };
    new Promise((resolve, reject) => {
        fetch(`${API_URL}/${SendMessage_API}`, {
            method: "PUT",
            body: JSON.stringify(reqBody),
            headers: {
                authorization: token,
            },
        })
            .then((res) => {
                console.log(res);
                if (res.code === 220){
                    alert(res.message)
                    console.log("성공")
            }
                else{
                    console.log("실패")
                }
            })
            .catch((error) => {
                console.log(error)
            });
        })
}


function Message(props) {
    const [visible, setVisible] = useState(false);
    const [receiver, setReceiver] = useState("");
    const [content, setContent] = useState("");

    const togglePopup = () => {
        setVisible(visible => !visible)
    }
    const onChangeReceiver = (e) => {
        setReceiver(e.target.value)
    };
    const onChangeContent = (e) => {
        setContent(e.target.value)
    }; 
    // const sendMessage = () => {};
    return (
      <div className={styled.messagePopup}>
        <button id ={styled.toggleBtn}onClick={togglePopup} />
        {visible ? (
            <div id ={styled.popup} visible={visible}>
                <button 
                    id ={styled.closeBtn} 
                    onClick={togglePopup}
                >x 
                </button>
                <div className={styled.message}> 
                    <input                      
                        id ="receiver"
                        type ="text"
                        placeholder="받는 사람 아이디 입력"
                        autoFocus
                        onChange={onChangeReceiver}
                    />
                    <hr />
                    <textarea
                        id ="content"
                        rows="8" 
                        cols="25"
                        placeholder="보낼 내용 입력"
                        onChange={onChangeContent}
                    />
                </div>
                    <button 
                        id ={styled.sendBtn}
                        onClick={()=>{
                            togglePopup()
                            sendMessage(receiver,content)
                        }}
                    >
                        Send
                    </button>
                </div>
            ) : (
                null
            )}      
        </div>   
    );
  }


export default Message;