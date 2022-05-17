import PropTypes from "prop-types";

// function ShowInfo({id,question,answer}){
//     return(
//         <div></div>
//     );
// }
function ShowInfo() {
  return (
    <div>
      <ul>
        <li>id</li>
        <li>닉네임</li>
        <li>포인트</li>
        <li>my question</li>
        <li>my answer</li>
        <li>my solution</li>
      </ul>
    </div>
  );
}
ShowInfo.prototype = {
  id: PropTypes.string.isRequired,
  question: PropTypes.arrayOf(PropTypes.string).isRequired,
  answer: PropTypes.string.isRequired,
};
export default ShowInfo;
