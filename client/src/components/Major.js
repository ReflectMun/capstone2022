import PropTypes from "prop-types";
import styled from '../css/nav.module.css';

function Major(props){
    const enrs = ["건축","기계","전자,전기","컴퓨터","토목","화학"];
    const hmns = ["국어국문","영어영문","철학","사학"];
    const natures = ["수학","물리","화학","생명"];
    const socials = ["행정","법학","사회복지"];
    const meds = ["의학","약학","간호학"];
    const arts = ["음악","미술","체육","무용"];
    // console.log(props);
    if (props.college === "공학")
    return(
    <ul  id ={styled.major}>
        {enrs.map((enr)=>
        <li key ={enr}>
            {enr}
        </li>)}
    </ul> 
    );
    else if (props.college === "인문")
    return(
        <ul  id ={styled.major}>
        {hmns.map((hmn)=>
        <li key ={hmn}>
            {hmn}
        </li>)}
    </ul>
    );
    else if (props.college === "자연")
    return(
        <ul  id ={styled.major}>
        {natures.map((nature)=>
        <li key ={nature}>
            {nature}
        </li>)}
    </ul>);
     else if (props.college === "사회")
     return(
         <ul  id ={styled.major}>
         {socials.map((social)=>
         <li key ={social}>
             {social}
         </li>)}
     </ul>);
      else if (props.college === "의약")
      return(
          <ul  id ={styled.major}>
          {meds.map((med)=>
          <li key ={med}>
              {med}
          </li>)}
      </ul>);
       else if (props.college === "예체능")
       return(
           <ul  id ={styled.major}>
           {arts.map((art)=>
           <li key ={art}>
               {art}
           </li>)}
       </ul>);
}

// Major.propTypes ={
//     collge : PropTypes.string.isRequired
// }

export default Major;