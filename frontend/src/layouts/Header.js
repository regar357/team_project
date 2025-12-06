import { Link } from "react-router-dom";
import "./Header.css";

const Header = () => {
  return (
    <header className="header">
      <div className="header-inner">

        <div className="logo">
          <Link to="/" className="logo-link"> 
            FreshLens
          </Link>
        </div>

        <nav className="nav">
          <Link to="/ingredients">식재료 등록</Link>
          <Link to="/">식재료 목록</Link>
          <Link to="/recipes/saved">레시피</Link>
          <Link to="/weekly-plan">주간 식단</Link>
          <Link to="/alerts">알림</Link>
          <Link to="/waste">폐기량</Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
