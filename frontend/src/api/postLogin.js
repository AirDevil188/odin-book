export default async function postLogin(email, password) {
  const response = await fetch("/api/log-in", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    throw new Error("Response error");
  }

  return await response.json();
}
