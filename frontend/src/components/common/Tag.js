import "./Tag.css";

const Tag = ({ label, active, onClick }) => {
  return (
    <span
      className={`tag ${active ? "active" : ""}`}
      onClick={onClick}
    >
      {label}
    </span>
  );
};

export default Tag;
