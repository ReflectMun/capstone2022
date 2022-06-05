import styles from "../css/Writer.module.css";
import MyEditor from "./MyEditor";
import { useState } from "react";

//메인 화면에서 글쓰기 버튼 클릭했을 때 나타나는 것. 게시물 안에서 답변하기 클릭했을 때 나타나는 것 아님. 다른 것
function Writer(props) {
  const [title, setTitle] = useState("");
  const [editor, setEditor] = useState(null);
  function onTitleChange(event) {
    console.log(event.target.value);
    setTitle(event.target.value);
  }
  function onClickWrite(event) {
    event.preventDefault();
    console.log(editor);
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
