import { Outlet, useLocation } from "react-router-dom"; 
import Header from "./Header";
import AppHeader from "./AppHeader"; 
import "../styles/global.css";
import "../styles/variables.css";
import "../styles/layout.css";

const MainLayout = () => {
  const location = useLocation();

  // 홈 페이지 여부 확인
  const isHome = location.pathname === "/";

  return (
    <div className="layout">
      {/* 홈에서는 기존 Header, 다른 페이지에서는 AppHeader */}
      {isHome ? <Header /> : <AppHeader />}

      <div className="layout-content">
        <Outlet />
      </div>
    </div>
  );
};

export default MainLayout;