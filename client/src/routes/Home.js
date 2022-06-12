import Message from "../components/Message";
import Nav from "../components/Nav";
import Mainarea from "../components/Mainarea";
import { useState } from "react";
function Home(props) {
  const [selectedMajor, setSelectedMajor] = useState("");
  return (
    <div>
      <Nav setSelectedMajor={setSelectedMajor} />
      <Mainarea selectedMajor={selectedMajor} setBoardURI={props.setBoardURI} />
      <Message />
    </div>
  );
}
export default Home;
