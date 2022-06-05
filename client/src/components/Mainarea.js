import { Link } from "react-router-dom";
import { useState } from "react";
import styles from "../css/Mainarea.module.css";
import Board from "./Board";
import Writer from "./Writer";

function Mainarea() {
  const [write, setWrite] = useState(false);
  const major = "컴퓨터 공학";
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
  const boardsList = boards.map((item) => (
    <li style={{ listStyle: "none" }}>
      <Link to={"/answer"} style={{ textDecoration: "none", color: "inherit" }}>
        <Board item={item} />
      </Link>
    </li>
  ));
  return (
    <center>
      <div className={styles.main_area}>
        <div
          style={{ display: "flex", marginLeft: "30px", marginRight: "30px" }}
        >
          <h2 className={styles.major}>{major}</h2>
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
        <select className={styles.board_type}>
          <option value="질문">질문</option>
          <option value="솔루션">솔루션</option>
        </select>
        <center>{write ? <Writer /> : null}</center>
        <ul style={{ margin: "0px", padding: "0px" }}>{boardsList}</ul>
      </div>
    </center>
  );
}
export default Mainarea;
