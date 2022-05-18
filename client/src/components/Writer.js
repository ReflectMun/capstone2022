import styles from "./Writer.module.css";

function Writer() {
  return (
    <div className={styles.writer_container}>
      <form>
        <div className={styles.wrap_title}>
          <input
            type="text"
            className={styles.title}
            autoComplete="off"
            placeholder="제목"
          />
        </div>
        <div className={styles.editor}>여기 에디터 들어올 곳</div>
        <input
          type="submit"
          className={styles.write_btn}
          value="등록"
          onClick={(event) => {
            event.preventDefault();
          }}
        />
      </form>
    </div>
  );
}
export default Writer;
