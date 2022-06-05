import PropTypes from "prop-types";
import styled from "../css/nav.module.css";

function Major(props) {
  const enrs = [
    "컴퓨터공학",
    "전기전자공학",
    "기계공학",
    "건축공학",
    "토목공학",
    "화학공학",
  ];
  const hmns = ["국어국문", "영어영문", "철학", "사학"];
  const natures = ["수학", "물리", "화학", "생물"];
  const socials = ["행정", "법학", "사회복지"];
  const meds = ["의학", "약학", "간호학"];
  const arts = ["음악", "미술", "체육", "무용"];
  function onClickMajor(event) {
    event.preventDefault();
    props.setSelectedMajor(event.target.innerText);
  }
  // console.log(props);
  if (props.college === "공학")
    return (
      <ul id={styled.majors}>
        {enrs.map((enr) => (
          <li key={enr} onClick={onClickMajor}>
            {enr}
          </li>
        ))}
      </ul>
    );
  else if (props.college === "인문")
    return (
      <ul id={styled.majors}>
        {hmns.map((hmn) => (
          <li key={hmn} onClick={onClickMajor}>
            {hmn}
          </li>
        ))}
      </ul>
    );
  else if (props.college === "자연")
    return (
      <ul id={styled.majors}>
        {natures.map((nature) => (
          <li key={nature} onClick={onClickMajor}>
            {nature}
          </li>
        ))}
      </ul>
    );
  else if (props.college === "사회")
    return (
      <ul id={styled.majors}>
        {socials.map((social) => (
          <li key={social} onClick={onClickMajor}>
            {social}
          </li>
        ))}
      </ul>
    );
  else if (props.college === "의약")
    return (
      <ul id={styled.majors}>
        {meds.map((med) => (
          <li key={med} onClick={onClickMajor}>
            {med}
          </li>
        ))}
      </ul>
    );
  else if (props.college === "예체능")
    return (
      <ul id={styled.majors}>
        {arts.map((art) => (
          <li key={art} onClick={onClickMajor}>
            {art}
          </li>
        ))}
      </ul>
    );
}

// Major.propTypes ={
//     collge : PropTypes.string.isRequired
// }

export default Major;
