const HIDDEN_CLASSNAME = "hidden";

function writeAnswer(){
  const btnWrap = document.querySelector(".wrap-ans-btn");
  const ansArea = document.querySelector(".answers-area");
  btnWrap.classList.add(HIDDEN_CLASSNAME);
  ansArea.classList.add(HIDDEN_CLASSNAME);
}

//when click the answer button, button and answers disappear
//and text editor appear
const ansButton = document.querySelector("#ans-btn");

ansButton.addEventListener("click",writeAnswer);