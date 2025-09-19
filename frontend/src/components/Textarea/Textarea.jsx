const Textarea = (props) => {
  return (
    <textarea
      name={props.name}
      id={props.id}
      onChange={props.onChange}
      value={props.value}
    ></textarea>
  );
};

export default Textarea;
