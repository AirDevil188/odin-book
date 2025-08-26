const Button = (props) => {
  return (
    <button type={props.type} id={props.id} className={props.className}>
      {props.text}
    </button>
  );
};

export default Button;
