import {
  createFileRoute,
  Link,
  redirect,
  useNavigate,
} from "@tanstack/react-router";
import styles from "./sign-up.module.css";
import Form from "../components/Form/Form";
import Label from "../components/Label/Label";
import Input from "../components/Input/Input";
import Button from "../components/Button/Button";
import { useMutation } from "@tanstack/react-query";
import postSignup from "../api/postSignup";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";

export const Route = createFileRoute("/sign-up")({
  beforeLoad: ({ context }) => {
    const { isAuthenticated } = context;
    if (isAuthenticated()) {
      throw redirect({ to: "/" });
    }
  },
  component: SignupRoute,
});

export function SignupRoute() {
  const authContext = useAuth();
  const [inputErrors, setInputErrors] = useState({});
  const navigate = useNavigate();
  const mutation = useMutation({
    mutationFn: (formData) => {
      return postSignup(
        formData.get("email"),
        formData.get("first_name"),
        formData.get("last_name"),
        formData.get("password"),
        formData.get("confirm_password"),
      );
    },
    onSuccess: (data) => {
      localStorage.setItem("toast_success", data.message);
      authContext.setAuthState(data);
      navigate({ to: "/" });
    },
    onError: (error) => {
      const errMessages = error.message.replace("Error: ", "");
      const errArray = JSON.parse(errMessages);
      const errObject = errArray.reduce((acc, currentErr) => {
        acc[currentErr.path] = currentErr.msg;
        return acc;
      }, {});

      setInputErrors(errObject);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    mutation.mutate(formData);
  };

  return (
    <div className={styles["signup"]}>
      <div className={styles["signup__wrapper"]}>
        <div className={styles["signup__form-wrapper"]}>
          <div className={styles["signup__heading-container"]}>
            <h3 className={styles["signup__heading-title"]}>New here?</h3>
            <span className="signup__heading-span">
              Come as a newcomer stay as family!
            </span>
          </div>
          <Form method="post" id="signup__form" onSubmit={handleSubmit}>
            <div className={styles["signup__form-group"]}>
              <Label htmlFor={"email"} />
              <Input
                type={"email"}
                placeholder={"Email"}
                name={"email"}
                id={"email"}
                className={
                  inputErrors.email
                    ? styles["signup__form-input--invalid"]
                    : null
                }
              />
              {inputErrors.email ? (
                <>
                  <div className={styles["signup__error-container"]}>
                    <p className={styles["signup__error-paragraph"]}>
                      {inputErrors.email}
                    </p>
                  </div>
                </>
              ) : null}
            </div>
            <div className={styles["signup__form-group"]}>
              <Label htmlFor={"first_name"} />
              <Input
                type={"text"}
                id={"first_name"}
                name={"first_name"}
                placeholder={"First Name"}
                className={
                  inputErrors.first_name
                    ? styles["signup__form-input--invalid"]
                    : null
                }
              />
              {inputErrors.first_name ? (
                <>
                  <div className={styles["signup__error-container"]}>
                    <p className={styles["signup__error-paragraph"]}>
                      {inputErrors.first_name}
                    </p>
                  </div>
                </>
              ) : null}
            </div>
            <div className={styles["signup__form-group"]}>
              <Label htmlFor={"last_name"} />
              <Input
                type={"text"}
                id={"last_name"}
                name={"last_name"}
                placeholder={"Last Name"}
                className={
                  inputErrors.last_name
                    ? styles["signup__form-input--invalid"]
                    : null
                }
              />
              {inputErrors.last_name ? (
                <>
                  <div className={styles["signup__error-container"]}>
                    <p className={styles["signup__error-paragraph"]}>
                      {inputErrors.last_name}
                    </p>
                  </div>
                </>
              ) : null}
            </div>
            <div className={styles["signup__form-group"]}>
              <Label htmlFor={"password"} />

              <Input
                type={"password"}
                name={"password"}
                id={"password"}
                placeholder={"Password"}
                className={
                  inputErrors.password
                    ? styles["signup__form-input--invalid"]
                    : null
                }
              />
              {inputErrors.password ? (
                <>
                  <div className={styles["signup__error-container"]}>
                    <p className={styles["signup__error-paragraph"]}>
                      {inputErrors.password}
                    </p>
                  </div>
                </>
              ) : null}
            </div>
            <div className={styles["signup__form-group"]}>
              <Label htmlFor={"confirm_password"} />
              <Input
                type={"password"}
                name={"confirm_password"}
                id={"confirm_password"}
                placeholder={"Confirm Password"}
                className={
                  inputErrors.confirm_password
                    ? styles["signup__form-input--invalid"]
                    : null
                }
              />
              {inputErrors.confirm_password ? (
                <>
                  <div className={styles["signup__error-container"]}>
                    <p className={styles["signup__error-paragraph"]}>
                      {inputErrors.confirm_password}
                    </p>
                  </div>
                </>
              ) : null}
            </div>

            <div className={styles["signup__button-container"]}>
              <Button type={"submit"} text={"Sign up"} />
            </div>
            <span>
              Already have an account? <Link to={"/log-in"}>Sign in</Link>
            </span>
          </Form>
        </div>
        <div className={styles["signup__image-container"]}>
          <div className={styles["signup__image-logo"]}></div>
        </div>
      </div>
    </div>
  );
}
