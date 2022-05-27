import Message from "../components/Message";
import Nav from "../components/Nav";
import Mainarea from "../components/Mainarea";

function Home(props) {
  function setIsLogin(loginValue) {
    props.setIsLogin(loginValue);
  }
  return (
    <div>
      <Nav loginValue={props.loginValue} setLogin={setIsLogin} />
      <Mainarea />
      <Message />
    </div>
  );
}
export default Home;
