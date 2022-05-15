import styles from "./Mainarea.module.css";
import Board from "./Board";
function Mainarea() {
  const major = "선택한 전공";
  return (
    <main>
      <h3 style={{ marginLeft: "5px" }}>{major}</h3>
      <Board />
    </main>
  );
}
export default Mainarea;
