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
        token: "token-mock-12345",
        userInfo: {
          id: "user-123",
          email: "test@email.com",
          name: "Test User",
        },
      },
      { status: 200 },
    );
  }),
];
