import { Link } from "react-router-dom";
import "./Header.css";

const Header = () => {
  return (
    <header className="header">
      <div className="header-inner">

        <div className="logo">
          FreshLens
        </div>

        <nav className="nav">
          <Link to="/">홈</Link>
          <Link to="/recipes/saved">저장된 레시피</Link>
          <Link to="/recipes/search">레시피 찾기</Link>
          <Link to="/weekly-plan">주간 식단</Link>
          <Link to="/alerts">알림</Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
