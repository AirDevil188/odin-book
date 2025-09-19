const Button = (props) => {
  return (
    <button
      type={props.type}
      id={props.id}
      className={props.className}
      onClick={props.onClick}
    >
      {props.text}
    </button>
  );
};

export default Button;
