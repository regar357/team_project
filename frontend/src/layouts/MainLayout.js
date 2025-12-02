import Header from "./Header";
import "../styles/global.css";
import "../styles/variables.css";
import "../styles/layout.css";

const MainLayout = ({ children }) => {
  return (
    <div className="layout">
      <Header />

      <div className="layout-content">
        {children}
      </div>
    </div>
  );
};

export default MainLayout;
