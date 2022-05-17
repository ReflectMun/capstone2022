import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./routes/Home";
import Login from "./routes/Login";
import Signup from "./routes/Signup";
import Writer from "./components/Writer";

import Message from "./components/Message";
import Nav from "./components/Nav";
function App() {
  return (
    <div>
      <Nav />
      <Message />
    </div>
  );
}
// function App() {
//   return (
//     <Router>
//       <Routes>
//         <Route path="/" element={<Home />} />
//         <Route path="/login" element={<Login />} />
//         <Route path="/signup" element={<Signup />} />
//       </Routes>
//     </Router>
//     //<Writer />
//   );
// }
export default App;
