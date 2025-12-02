import "./Button.css";

const Button = ({ children, onClick, type = "primary", size = "md", full }) => {
  return (
    <button
      className={`btn ${type} ${size} ${full ? "full" : ""}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default Button;
