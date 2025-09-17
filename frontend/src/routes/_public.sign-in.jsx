import { useNavigate, Link, createFileRoute } from "@tanstack/react-router";
import Form from "../components/Form/Form";
import Input from "../components/Input/Input";
import Label from "../components/Label/Label";
import Button from "../components/Button/Button";
import { useMutation } from "@tanstack/react-query";
import postLogin from "../api/postLogin";
import styles from "./sign-in.module.css";
import { useAuth } from "../context/AuthContext";

export const Route = createFileRoute("/_public/sign-in")({
  component: SigninRoute,
});

export function SigninRoute() {
  const authContext = useAuth();
  const navigate = useNavigate();
  const mutation = useMutation({
    mutationFn: (formData) => {
      return postLogin(formData.get("email"), formData.get("password"));
    },
    onSuccess: (data) => {
      localStorage.setItem("toast_success", data.message);
      authContext.setAuthState(data);
      navigate({ to: "/" });
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    mutation.mutate(formData);
  };
  return (
    <div className={styles["signin"]}>
      <div className={styles["signin_wrapper"]}>
        <div className={styles["signin__form-wrapper"]}>
          <div className={styles["signin__heading-container"]}>
            <h3 className={styles["signin__heading-title"]}>Welcome back</h3>
            <span className={styles["signin__heading-span"]}>
              Welcome back! Please enter your details
            </span>
          </div>
          <Form method="post" id="signin__form" onSubmit={handleSubmit}>
            <div className={styles["signin__form-group"]}>
              <Label htmlFor="email" />
              <Input
                required={true}
                type={"email"}
                name={"email"}
                id={"email"}
                placeholder={"Email"}
              />
            </div>
            <div className={styles["signin__form-group"]}>
              <Label htmlFor="password" />
              <Input
                required={true}
                type={"password"}
                placeholder={"Password"}
                name={"password"}
                id={"password"}
              />
            </div>
            <div className={styles["signin__button-container"]}>
              <Button type="submit" text="Sign in" />
            </div>
            <span>
              Don't have an account? <Link to={"/sign-up"}>Sign up</Link>
            </span>
          </Form>
        </div>
        <div className={styles["signin__image-container"]}>
          <div className={styles["signin__image-logo"]}></div>
        </div>
      </div>
    </div>
  );
}
