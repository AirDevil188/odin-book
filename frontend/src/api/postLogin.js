import axios from "../api/axiosInstance";

export default async function postLogin(email, password) {
  const response = await axios.post("/log-in", { email, password });

  return await response.data;
}
