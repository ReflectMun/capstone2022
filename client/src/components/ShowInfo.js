import PropTypes from "prop-types";
import styled from "../css/ShowInfo.module.css";
import MyContent from "../components/MyContent.js";

// function ShowInfo({id,question,answer}){
//     return(
//         <div></div>
//     );
// }
function getMyQuestion() {}
function getMyAnswer() {}
function getMyMessage() {}
function getMySolution() {}
function ShowInfo() {
  return (
    <div className={styled.info_container}>
      <ul className={styled.info_ul}>
        <li className={styled.info_li}>id</li>
        <li className={styled.info_li} onClick={getMyQuestion}>
          my question
        </li>
        <li className={styled.info_li}>닉네임</li>
        <li className={styled.info_li} onClick={getMyAnswer}>
          my answer
        </li>
        <li className={styled.info_li} onClick={getMyMessage}>
          쪽지
        </li>
        <li className={styled.info_li} onClick={getMySolution}>
          my solution
        </li>
      </ul>
      <MyContent />
    </div>
  );
}
// ShowInfo.prototype = {
//   id: PropTypes.string.isRequired,
//   question: PropTypes.arrayOf(PropTypes.string).isRequired,
//   answer: PropTypes.string.isRequired,
// };
export default ShowInfo;
