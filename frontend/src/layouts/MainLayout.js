import { Outlet, useLocation } from "react-router-dom";
import SidebarMenu from "./SidebarMenu";
import "../styles/global.css";
import "../styles/variables.css";
import "../styles/layout.css";

const MainLayout = () => {
  const location = useLocation();
  const isHome = location.pathname === "/";

  return (
    <div className={`layout ${isHome ? "layout-home" : ""}`}>
      {/* 
        홈이 아닌 페이지에서만 사이드바 + 일반 레이아웃 적용
        홈은 전체 화면 대시보드 느낌으로 사용
      */}

      <div className="layout-main">
        {!isHome && (
          <aside className="layout-sidebar">
            <SidebarMenu />
          </aside>
        )}

        <main className={`layout-content ${isHome ? "layout-content-home" : ""}`}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
