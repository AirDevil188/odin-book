const Form = (props) => {
  return (
    <form data-testid="form" method={props.method}>
      {props.children}
    </form>
  );
};

export default Form;
