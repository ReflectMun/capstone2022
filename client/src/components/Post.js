import question_sample from "./q_sample.png";
import styles from "../css/Post.module.css";
import Message from "../components/Message";
import Nav from "../components/Nav";
import { useEffect, useState } from "react";
import MyEditor from "./MyEditor";
import { getCookie } from "./Nav";
import { useParams } from "react-router-dom";

const token = getCookie("token");
const serverURL = "http://www.qnasavior.kro.kr";
const comment_api = "api/comment/fetch";
const answer_api = "api/post/fetch/answer";
const uploadComment_api = "api/comment/put";
const postNum = "1";

const API_URL = "http://www.qnasavior.kro.kr";
const CONTENT_API = "api/post/fetch/content";
const ANSWER_API = "api/upload/answer";
const ANSWER_LIST_API = "api/post/fetch/answer";

function Question(props) {
  const { boardURI, id } = useParams();
  const [title, setTitle] = useState("");
  let contents = "이 부분은 어떻게 돌아가는 것인지요?";
  let content = null;
  new Promise((resolve, reject) => {
    fetch(`${API_URL}/${CONTENT_API}?boardURI=${boardURI}&postNum=${id}`, {
      method: "GET",
      headers: { authorization: token },
    })
      .then((res) => res.json())
      .then((data) => {
        if ((data.code = 210)) {
          console.log(data);
          setTitle(data.Title);
          // const fs = require("fs");
          // const myData = fs.readFileSync(data.content, {
          //   encoding: "utf8",
          //   flag: "r",
          // });
          //내용 출력이랑 작성자 닉네임 출력 필요
          //const t = data.content.toString("utf-8");
        }
      });
  });
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
      <Comment />
    </div>
  );
}

function Solution() {
  const title = "이것은 답입니다";
  const contents = "참고하세요";
  return (
    <div className={styles.wrap_question}>
      <div>
        <span className={styles.q_icon}>S</span>
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

function Answer(props) {
  const answer = (
    <div style={{ marginLeft: "10px" }}>
      <p>어떻게 돌아가긴요?</p>
      <p>잘만 돌아가지요오~</p>
    </div>
  );
  const answerContent = props.item.content;
  const ansWriter = props.item.Nickname;
  // const answerList = answerLists.map(())
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
  const token1 = getCookie("token");
  const [editor, setEditor] = useState(null);
  const { id } = useParams();
  function onClickAnswer(event) {
    event.preventDefault();
    console.log(editor);
    console.log("답변의 id: " + id);
    if (editor === null || editor === "") {
      alert("내용을 입력해주세요");
      return;
    }
    const blobFile = new Blob([editor], {
      type: "text/html",
    });
    const file = new File([blobFile], "newAnswer.html");
    const data = new FormData();
    data.append("content", file);
    data.append("SourceQuestion", id);
    console.log(token1);
    return new Promise((resolve, reject) => {
      fetch(`${API_URL}/${ANSWER_API}`, {
        method: "PUT",
        headers: {
          authorization: token1,
        },
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          if (data.code === 231) {
            alert("답변 작성 완료");
            props.setAnswer(false);
          }
        })
        .catch((error) => {
          console.log(error);
          alert("답변 업로드 실패");
        });
    });
  }
  return (
    <div className={styles.box_sample}>
      <MyEditor
        handleChange={(data) => {
          setEditor(data);
        }}
        data={editor}
        {...props}
      />
      <input type="submit" value="작성" onClick={onClickAnswer} />
    </div>
  );
}

/////////////////////////////////////////////댓글////////////////////////////////////////////
function Comment() {
  const [comment, setComment] = useState("");
  const [visibleComment, setVisibleComment] = useState(false);

  const clickCommentBtn = () => {
    setVisibleComment(!visibleComment);
  };

  const changeText = (e) => {
    setComment(e.target.value);
  };
  const upLoadComment = () => {
    const reqBody = {
      postNum: postNum,
      text: comment,
    };
    fetch(`${serverURL}/${uploadComment_api}`, {
      method: "put",
      body: JSON.stringify(reqBody),
      headers: {
        "content-type": "application/json",
        authorization: token,
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
      });
  };

  return (
    <div>
      {visibleComment ? (
        <div className={styles.comment}>
          <textarea id={styles.comment_text} onChange={changeText}></textarea>
          <button
            id={styles.comment_btn}
            onClick={() => {
              upLoadComment();
              clickCommentBtn();
            }}
          >
            댓글달기
          </button>
        </div>
      ) : (
        <div>
          <button id={styles.comment_btn} onClick={clickCommentBtn}>
            comment
          </button>
        </div>
      )}
    </div>
  );
}

function Post(props) {
  const [answer, setAnswer] = useState(false);
  const { id } = useParams();
  const [answerList, setAnswerList] = useState([]);
  //원래 있던 댓글 가져오기
  function getComment() {
    fetch(`${serverURL}/${comment_api}?postNum=${postNum}`, {
      method: "get",
      headers: {
        "Content-Type": "application/json",
        authorization: null,
      },
    })
      .then((response) => response.json())
      .then((result) => {
        if (result.code === 270) {
          console.log(result.comments);
        } else {
          //console.log(result.code);
        }
      });
  }
  useEffect(() => {
    getComment();
  });

  //답변글 목록 가져오기
  function getAnswerList() {
    new Promise((resolve, reject) => {
      fetch(`${API_URL}/${ANSWER_LIST_API}?postNum=${id}`, {
        method: "GET",
        headers: { authorization: token },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.code === 212) {
            console.log("답변글 리스트");
            console.log(data.answerlist);
            setAnswerList(data.answerlist);
          }
        });
    });
  }
  useEffect(() => {
    getAnswerList();
  }, []);

  const pageAnswerList = answerList.map((item) => (
    <li key={item.AuthorUID}>
      <Answer item={item} />
    </li>
  ));

  return (
    <center>
      <Nav />
      <Message />
      <div className={styles.wrap_post}>
        <Question boardURI={props.boardURI} />
        <AnswerBtn
          onChangeMode={() => {
            if (answer === false) {
              setAnswer(true);
            } else if (answer === true) {
              setAnswer(false);
            }
          }}
        />
        {answer ? <AnswerBox setAnswer={setAnswer} /> : null}
        <ul style={{ listStyle: "none", padding: "0px" }}>{pageAnswerList}</ul>
      </div>
    </center>
  );
}

export default Post;
