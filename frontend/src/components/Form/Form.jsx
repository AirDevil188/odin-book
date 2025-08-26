const Form = (props) => {
  return (
    <form
      data-testid="form"
      method={props.method}
      action={props.action}
      onSubmit={props.onSubmit}
    >
      {props.children}
    </form>
  );
};

export default Form;
