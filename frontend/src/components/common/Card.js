// import "./Card.css";

// const Card = ({ children, onClick }) => {
//   return (
//     <div className="card" onClick={onClick}>
//       {children}
//     </div>
//   );
// };

// export default Card;

import "./Card.css";

const Card = ({ children, onClick, className = "", ...rest }) => {
  return (
    <div
      className={`card ${className}`}
      onClick={onClick}
      {...rest}
    >
      {children}
    </div>
  );
};

export default Card;
