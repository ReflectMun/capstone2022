import React, { useState } from 'react';
import styled from '../css/message.module.css';
function Message() {
    const [visible, setVisible] = useState(false);
    const togglePopup = () => {
        setVisible(visible => !visible)
    }
    const onChangeReceiver = () => {};
    const onChangeContent = () => {}; 
    const sendMessage = () => {};
    return (
      <div className={styled.messagePopup}>
        <button id ={styled.toggleBtn}onClick={togglePopup} />
        {visible ? (
            <div id ={styled.popup} visible={visible}>
                <header>
                <button 
                    id ={styled.closeBtn} 
                    onClick={togglePopup}
                >x 
                </button>
                </header>
                <main className={styled.message}> 
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
                </main>
                <footer>
                    <button 
                        id ={styled.sendBtn}
                        onClick={()=>{
                            togglePopup()
                            sendMessage()
                        }}
                    >
                        Send
                    </button>
                </footer>
                </div>
            ) : (
                null
            )}      
        </div>   
    );
  }


export default Message;