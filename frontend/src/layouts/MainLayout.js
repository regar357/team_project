import { Outlet, useLocation } from "react-router-dom"; 
import SidebarMenu from "./SidebarMenu";  
import "../styles/global.css";
import "../styles/variables.css";
import "../styles/layout.css";

const MainLayout = () => {
  const location = useLocation();
  const isHome = location.pathname === "/";

  // 홈 페이지 : 전체 화면으로 사용

   if (isHome) {
    return (
      <div className="layout">
        <div className="layout-content layout-content-home">
          <Outlet />
        </div>
      </div>
    );
  }

  // 페이지: 상단 AppHeader + 좌측 사이드바 + 우측 메인 컨텐츠
  return (
    <div className="layout">


      <div className="layout-main">
        <aside className="layout-sidebar">
          <SidebarMenu />
        </aside>

        <main className="layout-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;