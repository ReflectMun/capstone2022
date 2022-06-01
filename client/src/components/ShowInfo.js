import PropTypes from "prop-types";
import styled from "../css/ShowInfo.module.css";
import MyContent from "../components/MyContent.js";

// function ShowInfo({id,question,answer}){
//     return(
//         <div></div>
//     );
// }

function ShowInfo() {
  return (
    <div className={styled.info_container}>
      <ul className={styled.info_ul}>
        <li className={styled.info_li}>id</li>
        <li className={styled.info_li}>my question</li>
        <li className={styled.info_li}>닉네임</li>
        <li className={styled.info_li}>my answer</li>
        <li className={styled.info_li} id={styled.info_bottom}>
          쪽지
        </li>
        <li className={styled.info_li} id={styled.info_bottom}>
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
