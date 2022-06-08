import styles from "../css/Board.module.css";
//import thumbnail from "./thumbnail_test.png";

function Board(props) {
  const postId = props.item.PostId;
  const title = props.item.Title;
  //const contents = props.item.contents;
  const writer = props.item.AuthorNickname;
  //const image = props.item.image;
  const date = props.item.Date.slice(0, 10);
  const time = props.item.Time.slice(0, 8);
  return (
    <div className={styles.board_container}>
      <div style={{ display: "flex" }}>
        <div className={styles.wrap_title_contents}>
          <h4 style={{ marginLeft: "10px" }}>{title}</h4>
          {/* <p style={{ marginLeft: "10px", fontSize: "1rem" }}>{contents}</p> */}
        </div>
        {/*만약 썸네일이미지가 없다면 출력안하고, 그렇지 않다면 이미지 출력*/}
        {/* <img src={image} alt="NO IMAGE" className={styles.thumbnail} /> */}
      </div>
      <span className={styles.writer}>{writer}</span>
      <span className={styles.writer}>{date}</span>
      <span className={styles.writer}>{time}</span>
    </div>
  );
}
export default Board;
