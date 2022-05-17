import question_sample from "./q_sample.png";
import styles from "./Post.module.css";

function Question() {
  const title = "이것은 무엇을 의미하는 건지요?";
  const contents = "이 부분은 어떻게 작동하는 건인지요?";
  return (
    <div className={styles.wrap_post}>
      <div>
        <span className={styles.q_icon}>Q</span>
        <span className={styles.question_title}>{title}</span>
      </div>
      <div>
        <p style={{ marginLeft: "10px" }}>{contents}</p>
        <img
          src={question_sample}
          style={{ margin: "5px", width: "70%" }}
          alt="image load error"
        />
      </div>
    </div>
  );
}
function AnswerBtn() {
  return (
    <div className={styles.wrap_ans_btn}>
      <button className={styles.ans_btn}>답변하기</button>
    </div>
  );
}

function Answer() {
  const answer =
    "이러이러하고 저러저러하고 그러그러해서 이러저러그러하게 됩니다";
  const ansWriter = "asdf1234";
  return (
    <div className={styles.wrap_answer}>
      <div className={styles.wrap_ans_name}>
        <span className={styles.a_icon}>A</span>
        <span>{ansWriter}</span>
      </div>
      <div>
        {/* 답변 내용이 들어가야 할 곳*/}
        <p>이러이러하고...</p>
        <p>저러저러하고</p>
        <p>그러그러하기 때문에</p>
        <p>이러저러그러한 것 이죠.</p>
      </div>
    </div>
  );
}
function Post() {
  return (
    <div style={{ width: "40%" }}>
      <Question />
      <AnswerBtn />
      <Answer />
    </div>
  );
}
export default Post;
