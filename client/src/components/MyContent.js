import { useEffect, useState } from "react";
import styled from "../css/MyContent.module.css";

const API_URL = "http://www.qnasavior.kro.kr";

function MyContent(props) {
 const content = props.content;
    return (
        <div className={styled.container}>
          <p>{content}</p>
      </div>
    );
  }
export default MyContent;