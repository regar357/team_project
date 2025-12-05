import "./Badge.css";

const Badge = ({ text, type = "normal" }) => {
  return <span className={`badge ${type}`}>{text}</span>;
};

export default Badge;
