import styles from "./Board.module.css";
import thumbnail from "./thumbnail_test.png";

function Board() {
  const title = "제목";
  const contents = "내용 앞부분 일부만 출력...";
  const writer = "작성자 닉네임";
  return (
    <div className={styles.board_container}>
      <div style={{ display: "flex" }}>
        <div className={styles.wrap_title_contents}>
          <h4 style={{ marginLeft: "10px" }}>{title}</h4>
          <p style={{ marginLeft: "10px", fontSize: "1rem" }}>{contents}</p>
        </div>
        {/*만약 썸네일이미지가 없다면 출력안하고, 그렇지 않다면 이미지 출력*/}
        <img src={thumbnail} alt="error" className={styles.thumbnail} />
      </div>
      <h5 className={styles.writer}>{writer}</h5>
    </div>
  );
}
export default Board;
