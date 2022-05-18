import question_sample from "./q_sample.png";
import styles from "../css/Post.module.css";
import Message from "../components/Message";
import Nav from "../components/Nav";
import { useState } from "react";

function Question() {
  const title = "이것은 무엇을 의미하는 건지요?";
  const contents = "이 부분은 어떻게 작동하는 건인지요?";
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
      <p>이러이러하고...</p>
      <p>저러저러하고</p>
      <p>그러그러하기 때문에</p>
      <p>이러저러그러한 것 이죠.</p>
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
function AnswerBox() {
  return <div className={styles.box_sample}>Text Editor</div>;
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
