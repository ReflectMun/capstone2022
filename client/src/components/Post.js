import question_sample from "./q_sample.png";
import styles from "../css/Post.module.css";
import Message from "../components/Message";
import Nav from "../components/Nav";
import { useState } from "react";
import MyEditor from "./MyEditor";
import { getCookie } from './Nav';

const token = getCookie("token");
const serverURL = "http://www.qnasavior.kro.kr";
const comment_api = "api/comment";

///////////////////////////////////////날짜////////////////////////////
let day = new Date();
let year = day.getFullYear(); // 년도
let month = day.getMonth() + 1;  // 월
let date = day.getDate();  //일
let hours = day.getHours(); // 시
let minutes = day.getMinutes();  // 분
let seconds = day.getSeconds();  //초
let today = year + month + date
let time = hours + minutes + seconds

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
        <p style={{ marginLeft: "10px" }}>{contents}</p>
        <img
          src={question_sample}
          style={{ margin: "5px", width: "80%" }}
          alt="load error"
        />
      </div>
      <Comment />
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
  const answer = (
    <div style={{ marginLeft: "10px" }}>
      <p>어떻게 돌아가긴요?</p>
      <p>잘만 돌아가지요오~</p>
    </div>
  );

  const ansWriter = "asdf1234";
  return (
    <div className={styles.wrap_answer}>
      <div className={styles.wrap_ans_name}>
        <span className={styles.a_icon}>A</span>
        <span>{ansWriter}</span>
      </div>
      {answer}
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
/////////////////////////////////////////////댓글////////////////////////////////////////////
function Comment(){
  const[comment,setComment] =useState("");
  const [visibleComment,setVisibleComment]=useState(false);
  const clickCommentBtn =()=>{
    setVisibleComment(!visibleComment);
  }
  const changeText=(e)=>{
    setComment(e.target.value);
  }
  const upLoadComment=()=>{
    var data = new FormData();
    data.append("SourcePost",1);
    data.append("Author","ComputerScience");
    data.append("nickname","hi~~");
    data.append("comment",comment);
    data.append("date",comment);
    data.append("time",comment);

    console.log(data.values());
    console.log(date);
      fetch(`${serverURL}/${comment_api}`, {
        method: "post",
        body:data,
        headers: { 
          "Content-Type": "multipart/form-data",
          authorization: token },
      })
        .then((result) => {
          if (result.code === 200) {
            console.log(result.code);
          }
          else if (result.code === 500){
            alert("다시 시도해주세요.");
          }
        })
        .catch((error) => {
          console.log(error);
        })
  }
  return(
    visibleComment ? (
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
    )

  )
}
function Post() {
  const [answer, setAnswer] = useState(false);

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
