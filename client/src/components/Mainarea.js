import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import styles from "../css/Mainarea.module.css";
import Board from "./Board";
import Writer from "./Writer";

const API_URL = "http://www.qnasavior.kro.kr";
const POSTLIST_API = "api/post/fetch/postlist";
let BoardURI = "";
let pageNum = 0;

function getCookie(key) {
  key = new RegExp(key + "=([^;]*)"); // 쿠키들을 세미콘론으로 구분하는 정규표현식 정의
  return key.test(document.cookie) ? unescape(RegExp.$1) : ""; // 인자로 받은 키에 해당하는 키가 있으면 값을 반환
}

function Mainarea(props) {
  const [write, setWrite] = useState(false);
  const [boardType, setBoardType] = useState("1");
  const [boardLists, setBoardLists] = useState([]);
  function changeBoardType(event) {
    setBoardType(event.target.value);
  }
  function onClickMore(event) {
    event.preventDefault();
    pageNum++;
    loadPosts();
  }
  function loadPosts() {
    //console.log(BoardURI);
    new Promise((resolve, reject) => {
      const pageNumString = pageNum.toString();
      fetch(
        `${API_URL}/${POSTLIST_API}?boardURI=${BoardURI}&pageNum=${pageNumString}&Type=${boardType}`,
        {
          method: "GET",
          headers: { authorization: null },
        }
      )
        .then((res) => res.json())
        .then((data) => {
          if (data.code === 210) {
            if (data.postlist.length === 0) {
              alert("마지막 페이지입니다");
            } else {
              console.log("load data: ", data.postlist);
              setBoardLists([...boardLists, ...data.postlist]);
            }
          } else {
            alert("load error");
            return;
          }
        })
        .catch((error) => {
          console.log(error);
        });
    });
  }
  const boards = [
    {
      title: "이것은 무엇을 의미하는 건지요?",
      contents: "이 부분은 어떻게 작동하는 것인지요?",
      image:
        "https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2FkX7s9%2FbtqRGqz2o7d%2FKabf7EFb1GDUlZjG4B1sH1%2Fimg.png",
      nickName: "Kim",
    },
    {
      title: "React 관련 질문입니다",
      contents: "useState 어떻게 쓰는 건가요?",
      image:
        "https://velog.velcdn.com/images%2Ftnehd1998%2Fpost%2Fb7b0c81e-8be4-411b-9d6f-d04b3dabb10d%2Fusestate.png",
      nickName: "Ahn",
    },
    {
      title: "c언어 포인터 질문",
      contents: "포인터 사용방법",
      image: "https://file.okky.kr/images/1633747687905.PNG",
      nickName: "Mun",
    },
    {
      title: "크러스컬 알고리즘",
      contents: "크러스컬 알고리즘 코드 확인 좀...",
      image: "https://i.imgur.com/4wIFiNX.png",
      nickName: "Han",
    },
    {
      title: "자료구조 질문",
      contents: "스택이랑 큐랑..?",
      image:
        "https://velog.velcdn.com/images/y1andyu/post/737a6a36-ebef-4781-af14-da432d3ee1cd/1_GNA2E1NFiJMc6cTHHPa6kw.png",
      nickName: "lee",
    },
  ];
  //게시물 리스트 가져오기
  switch (props.selectedMajor) {
    case "컴퓨터공학":
      BoardURI = "ComputerScience";
      props.setBoardURI("ComputerScience");
      break;
    case "전기전자공학":
      BoardURI = "ElectricalAndElectronic";
      props.setBoardURI("ElectricalAndElectronic");
      break;
    case "기계공학":
      BoardURI = "Mechanical";
      props.setBoardURI("Mechanical");
      break;
    case "건축공학":
      BoardURI = "Architecture";
      props.setBoardURI("Architecture");
      break;
    case "토목공학":
      BoardURI = "Civil";
      props.setBoardURI("Civil");
      break;
    case "화학공학":
      BoardURI = "Chemical";
      props.setBoardURI("Chemical");
      break;
    case "국어국문":
      BoardURI = "Korean";
      props.setBoardURI("Korean");
      break;
    case "영어영문":
      BoardURI = "English";
      props.setBoardURI("English");
      break;
    case "철학":
      BoardURI = "Philosophy";
      props.setBoardURI("Philosophy");
      break;
    case "사학":
      BoardURI = "History";
      props.setBoardURI("History");
      break;
    case "수학":
      BoardURI = "Math";
      props.setBoardURI("Math");
      break;
    case "물리":
      BoardURI = "Physics";
      props.setBoardURI("Physics");
      break;
    case "화학":
      BoardURI = "Chemistry";
      props.setBoardURI("Chemistry");
      break;
    case "생물":
      BoardURI = "Biology";
      props.setBoardURI("Biology");
      break;
    case "행정":
      BoardURI = "Administration";
      props.setBoardURI("Administration");
      break;
    case "법학":
      BoardURI = "Law";
      props.setBoardURI("Law");
      break;
    case "사회복지":
      BoardURI = "SocialWelfare";
      props.setBoardURI("SocialWelfare");
      break;
    case "의학":
      BoardURI = "Medical";
      props.setBoardURI("Medical");
      break;
    case "약학":
      BoardURI = "Pharmacy";
      props.setBoardURI("Pharmacy");
      break;
    case "간호학":
      BoardURI = "Nursing";
      props.setBoardURI("Nursing");
      break;
    case "음악":
      BoardURI = "Music";
      props.setBoardURI("Music");
      break;
    case "미술":
      BoardURI = "Art";
      props.setBoardURI("Art");
      break;
    case "체육":
      BoardURI = "Athletic";
      props.setBoardURI("Athletic");
      break;
    case "무용":
      BoardURI = "Dance";
      props.setBoardURI("Dance");
      break;
  }

  const boardsList = boardLists.map((item) => (
    <li key={item.PostID} style={{ listStyle: "none" }}>
      <Link
        to={`/${BoardURI}/${item.PostID}`}
        style={{ textDecoration: "none", color: "inherit" }}
      >
        <Board item={item} />
      </Link>
    </li>
  ));

  useEffect(() => {
    console.log(props.selectedMajor);
    setBoardLists([]);
    console.log("useEffect1 ", boardLists);
    if (props.selectedMajor !== "") {
      loadPosts();
    }
  }, [props.selectedMajor]);

  return (
    <center>
      <div className={styles.main_area}>
        <div
          style={{ display: "flex", marginLeft: "30px", marginRight: "30px" }}
        >
          <h2 className={styles.major}>{props.selectedMajor}</h2>
          <button
            className={styles.write_btn}
            onClick={(event) => {
              event.preventDefault();
              if (write === false) {
                setWrite(true);
              } else if (write === true) {
                setWrite(false);
              }
            }}
          >
            글쓰기
          </button>
        </div>
        <select className={styles.board_type} onChange={changeBoardType}>
          <option value="1">질문</option>
          <option value="2">솔루션</option>
        </select>
        <center>
          {write ? (
            <Writer
              major={props.selectedMajor}
              boardType={boardType}
              setWrite={setWrite}
            />
          ) : null}
        </center>
        <ul style={{ margin: "0px", padding: "0px" }}>{boardsList}</ul>
        <button onClick={onClickMore}>더보기</button>
      </div>
    </center>
  );
}
export default Mainarea;
