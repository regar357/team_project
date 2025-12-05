import "./Input.css";

const Input = ({ label, type = "text", ...props }) => {
  return (
    <div className="input-wrapper">
      {label && <label>{label}</label>}
      <input type={type} {...props} />
    </div>
  );
};

export default Input;
