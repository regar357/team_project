import { Outlet } from "react-router-dom"; 
import Header from "./Header";
import "../styles/global.css";
import "../styles/variables.css";
import "../styles/layout.css";

const MainLayout = () => {
  return (
    <div className="layout">
      <Header />

      <div className="layout-content">
        <Outlet /> 
      </div>
    </div>
  );
};

export default MainLayout;