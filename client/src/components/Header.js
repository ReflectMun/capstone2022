import { Link } from "react-router-dom";
//import styles from "./Header.module.css";

const Header = () => {
  return (
    <header>
      <div>
        <button>Nav</button>
        <div>Logo</div>

        <div>
          <ul>
            <li>POINT({0})</li>
            <li>ACCOUNT</li>
            <li>MSG</li>
            <li>
              <Link to={"/login"} style={{ textDecoration: "none" }}>
                LOGIN
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </header>
  );
};
export default Header;
