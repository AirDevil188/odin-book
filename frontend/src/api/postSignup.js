import axios from "../api/axiosInstance";

export default async function postSignup(
  email,
  first_name,
  last_name,
  password,
  confirm_password,
) {
  const response = await axios.post("/sign-up", {
    email,
    first_name,
    last_name,
    password,
    confirm_password,
  });

  if (!response.ok) {
    const { errors } = await response.json();
    const simplifiedErrors = errors.map((error) => ({
      msg: error.msg,
      path: error.path,
    }));

    throw new Error(JSON.stringify(simplifiedErrors));
  }

  return await response.data;
}
