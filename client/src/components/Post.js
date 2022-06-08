import question_sample from "./q_sample.png";
import styles from "../css/Post.module.css";
import Message from "../components/Message";
import Nav from "../components/Nav";
import { useEffect, useState } from "react";
import MyEditor from "./MyEditor";
import { getCookie } from './Nav';

const token = getCookie("token");
const serverURL = "http://www.qnasavior.kro.kr";
const comment_api = "api/comment/fetch";
const answer_api = "api/post/fetch/answer";
const uploadComment_api="api/comment/put";


function Question() {
  const title = "이것은 무엇을 의미하는 건지요?";
  const contents = "이 부분은 어떻게 돌아가는 것인지요?";
  return (
      <div className={styles.wrap_question}>
        <div>
          <span className={styles.q_icon}>Q</span>
          <span className={styles.question_title}>{title}</span>
        </div>
        <div>
          <p>{contents}</p>
          <img
            src={question_sample}
            style={{ margin: "5px", width: "80%" }}
            alt="load error"
          />
        </div>
        <UploadComment />
    </div>
  );
}

function AnswerBtn(props) {
  return (
    <div className={styles.wrap_ans_btn}>
      <button
        className={styles.ans_btn}
        onClick={(event) => {
          event.preventDefault();
          props.onChangeMode();
        }}
      >
        답변하기
      </button>
    </div>
  );
}


function Answer() {
  // const answer = (
  //   <div style={{ marginLeft: "10px" }}>
  //     <p>어떻게 돌아가긴요?</p>
  //     <p>잘만 돌아가지요오~</p>
  //   </div>
  // );


  // const ansWriter = "asdf1234";
  const postNum ="1";
  function getAnswer(){
    fetch(
      `${serverURL}/${answer_api}?postNum=${postNum}`, 
      {
        method: "get",
        headers: { 
          //"Content-Type": "application/json",
          authorization: token 
        }
    })
    .then((response)=>response.json())
      .then((result) => {
        console.log(result);
        if (result.code === 212) { 
          console.log(result);        
        }
        else {
          // console.log(result);
        }
      })
  }
  useEffect(()=>{
    getAnswer();
  })
  return (
    <div className={styles.wrap_answer}>
      {/* <div className={styles.wrap_ans_name}>
        <span className={styles.a_icon}>A</span>
        <span>{ansWriter}</span>
      </div>
      {answer} */}
      ㅁㅁㅁㅁ
    </div>
  );
}
//ckeditor 사용
function AnswerBox(props) {
  const [editor, setEditor] = useState(null);
  return (
    <div className={styles.box_sample}>
      <MyEditor
        handleChange={(data) => {
          setEditor(data);
        }}
        data={editor}
        {...props}
      />
      <input
        type="submit"
        onClick={(event) => {
          event.preventDefault();
          console.log(editor);
        }}
      />
    </div>
  );
}
/////////////////////////////////////////////댓글등록////////////////////////////////////////////
function UploadComment(){
  const[comment,setComment] =useState("");
  const [visibleComment,setVisibleComment]=useState(false);
  const clickCommentBtn =()=>{
    setVisibleComment(!visibleComment);
  }
  const changeText=(e)=>{
    setComment(e.target.value);
  }

  const postNum="37";
  const upLoadComment=()=>{
   const reqBody = {
    postNum: postNum,
    text: comment,
  };
      fetch(`${serverURL}/${uploadComment_api}`, {
        method: "put",
        body: JSON.stringify(reqBody),
        headers: { 
          "content-type": "application/json",
          authorization: token 
        },
      })
        .then((response) => response.json())
        .then((result) => {
          if (result.code === 271) {
            alert(result.message);
          }
        })
        .catch((error) => {
          console.log(error);
        })
  }
  return(
    <div>
      {visibleComment ? (
      <div className={styles.comment}>
        <textarea
          id={styles.comment_text} 
          onChange={changeText}></textarea>
        <button 
          id ={styles.comment_btn}
          onClick={()=>{
            upLoadComment();
            clickCommentBtn();
            }}
      >댓글달기</button>
      </div>
      ) : (
        <div>
          <button 
          id ={styles.comment_btn}
          onClick={clickCommentBtn}
          >comment</button>
        </div>
      )}
    </div>
  )
}

function Post() {
  const [answer, setAnswer] = useState(false);
  
  //원래 있던 댓글 가져오기
  const postNum = "37";
  function getComment(){
    fetch(
      `${serverURL}/${comment_api}?postNum=${postNum}`, 
      {
        method: "get",
        headers: { 
          "Content-Type": "application/json",
          authorization: null
        }
    })
    .then((response)=>response.json())
      .then((result) => {
          console.log(result);
        if (result.code === 270) {         
        }
        else {
          //console.log(result.code);
        }
      })
      }
      useEffect(()=>{
        getComment();
      })
  return (
    <center>
      <Nav />
      <Message />
      <div className={styles.wrap_post}>
        <Question />

        <AnswerBtn
          onChangeMode={() => {
            if (answer === false) {
              setAnswer(true);
            } else if (answer === true) {
              setAnswer(false);
            }
          }}
        />
        {answer ? <AnswerBox /> : null}
        <Answer />
      </div>
    </center>
  );
}


export default Post;
