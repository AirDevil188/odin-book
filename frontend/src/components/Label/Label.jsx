const Label = (props) => {
  return <label htmlFor={props.htmlFor}>{props.text}</label>;
};

export default Label;
