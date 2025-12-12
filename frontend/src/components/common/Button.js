import "./Button.css";

const Button = ({ children, onClick, type = "primary", size = "md", full, className = "" }) => {
  return (
    <button
      className={`btn ${type} ${size} ${full ? "full" : ""} ${className}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default Button;
