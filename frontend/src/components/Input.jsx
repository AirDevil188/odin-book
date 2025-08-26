const Input = (props) => {
  return (
    <input
      type={props.type}
      required={props.required}
      name={props.name}
      id={props.id}
      placeholder={props.placeholder}
    />
  );
};

export default Input;
