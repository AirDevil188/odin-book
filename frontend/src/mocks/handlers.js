import { http, HttpResponse } from "msw";

export const handlers = [
  http.post("/api/log-in", async ({ request }) => {
    const { email, password } = await request.json();

    // wrong credentials
    if (email !== "test@email.com" || password !== "Test1234!") {
      return new HttpResponse.json(
        { message: "Wrong email or password" },
        { status: 401 },
      );
    }

    // successful credentials

    return HttpResponse.json(
      {
        message: "Authentication successful",
        userInfo: {
          id: "user-123",
          email: "test@email.com",
          name: "Test User",
        },
      },
      { status: 200 },
    );
  }),

  http.post("/api/sign-up", async ({ request }) => {
    const { email, password, confirm_password, first_name, last_name } =
      await request.json();

    if (password !== confirm_password) {
      return HttpResponse.json(
        {
          errors: [
            {
              msg: "Passwords must match.",
              path: "confirm_password",
            },
          ],
        },
        { status: 422 },
      );
    }

    // successful request
    return HttpResponse.json(
      {
        message: "User created!",
        userInfo: {
          email: email,
          role: "user",
          first_name: first_name,
          last_name: last_name,
        },
      },
      { status: 200 },
    );
  }),
];
