import { Link } from "react-router-dom";
import { useState } from "react";
import styles from "../css/Mainarea.module.css";
import Board from "./Board";
import Writer from "./Writer";

function Mainarea() {
  const [write, setWrite] = useState(false);
  const major = "컴퓨터 공학";
  const boards = [{ 1: "1" }, { 2: "2" }, { 3: "3" }, { 4: "4" }, { 5: "5" }];
  const boardsList = boards.map((item) => (
    <li style={{ listStyle: "none" }}>
      <Link to={"/answer"} style={{ textDecoration: "none", color: "inherit" }}>
        <Board />
      </Link>
    </li>
  ));
  return (
    <center>
      <div className={styles.main_area}>
        <div style={{ display: "flex", marginLeft: "30px" }}>
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
        <center>{write ? <Writer /> : null}</center>
        <ul style={{ margin: "0px", padding: "0px" }}>{boardsList}</ul>
      </div>
    </center>
  );
}
export default Mainarea;
