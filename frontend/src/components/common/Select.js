import "./Select.css";

const Select = ({ label, options = [], ...props }) => {
  return (
    <div className="select-wrapper">
      {label && <label>{label}</label>}
      <select {...props}>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Select;
