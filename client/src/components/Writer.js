import styles from "../css/Writer.module.css";
import MyEditor from "./MyEditor";
import { useState } from "react";

//메인 화면에서 글쓰기 버튼 클릭했을 때 나타나는 것. 게시물 안에서 답변하기 클릭했을 때 나타나는 것 아님. 다른 것

function getCookie(key) {
  key = new RegExp(key + "=([^;]*)"); // 쿠키들을 세미콘론으로 구분하는 정규표현식 정의
  return key.test(document.cookie) ? unescape(RegExp.$1) : ""; // 인자로 받은 키에 해당하는 키가 있으면 값을 반환
}

const API_URL = "http://www.qnasavior.kro.kr";
const UPLOAD_API = "api/upload/content";
let BoardURI = "";
function Writer(props) {
  const [title, setTitle] = useState("");
  const [editor, setEditor] = useState(null);
  const [type, setType] = useState("1");
  switch (props.major) {
    case "컴퓨터공학":
      BoardURI = "ComputerScience";
      break;
    case "전기전자공학":
      BoardURI = "ElectricalAndElectronic";
      break;
    case "기계공학":
      BoardURI = "Mechanical";
      break;
    case "건축공학":
      BoardURI = "Architecture";
      break;
    case "토목공학":
      BoardURI = "Civil";
      break;
    case "화학공학":
      BoardURI = "Chemical";
      break;
    case "국어국문":
      BoardURI = "Korean";
      break;
    case "영어영문":
      BoardURI = "English";
      break;
    case "철학":
      BoardURI = "Philosophy";
      break;
    case "사학":
      BoardURI = "History";
      break;
    case "수학":
      BoardURI = "Math";
      break;
    case "물리":
      BoardURI = "Physics";
      break;
    case "화학":
      BoardURI = "Chemistry";
      break;
    case "생물":
      BoardURI = "Biology";
      break;
    case "행정":
      BoardURI = "Administration";
      break;
    case "법학":
      BoardURI = "Law";
      break;
    case "사회복지":
      BoardURI = "SocialWelfare";
      break;
    case "의학":
      BoardURI = "Medical";
      break;
    case "약학":
      BoardURI = "Pharmacy";
      break;
    case "간호학":
      BoardURI = "Nursing";
      break;
    case "음악":
      BoardURI = "Music";
      break;
    case "미술":
      BoardURI = "Art";
      break;
    case "체육":
      BoardURI = "Athletic";
      break;
    case "무용":
      BoardURI = "Dance";
      break;
  }
  function onTitleChange(event) {
    setTitle(event.target.value);
  }
  function onClickWrite(event) {
    event.preventDefault();
    const token = getCookie("token");
    console.log("type number: " + typeof type);
    setType(props.boardType);
    console.log(editor);

    if (title === null || title === "") {
      alert("제목을 입력해주세요");
      return;
    }
    if (editor === null || editor === "") {
      alert("내용을 입력해주세요");
      return;
    }
    const blobFile = new Blob([editor], {
      type: "text/html",
    });
    const file = new File([blobFile], "newPost.html");
    const data = new FormData();
    data.append("content", file);
    data.append("BoardURI", BoardURI);
    data.append("Title", title);
    data.append("Type", type);
    return new Promise((resolve, reject) => {
      fetch(`${API_URL}/${UPLOAD_API}`, {
        method: "PUT",
        headers: {
          "Content-Type": "multipart/form-data",
          authorization: token,
        },
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.code === 230) {
            alert("작성 완료");
          }
        })
        .catch((error) => {
          console.log(error);
          alert("업로드 실패");
        });
    });
  }
  return (
    <div className={styles.writer_container}>
      <form>
        <div className={styles.wrap_title}>
          <input
            value={title}
            type="text"
            className={styles.title}
            autoComplete="off"
            placeholder="제목"
            onChange={onTitleChange}
          />
        </div>
        <div className={styles.editor}>
          <MyEditor
            handleChange={(data) => {
              setEditor(data);
            }}
            data={editor}
            {...props}
          />
          <input
            className={styles.write_btn}
            type="submit"
            value="등록"
            onClick={onClickWrite}
          />
        </div>
      </form>
    </div>
  );
}
export default Writer;
