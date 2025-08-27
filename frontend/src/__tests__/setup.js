import { expect, afterEach, afterAll, beforeAll } from "vitest";
import { cleanup } from "@testing-library/react";
import * as matchers from "@testing-library/jest-dom/matchers";
import { server } from "../mocks/server";

expect.extend(matchers);

beforeAll(() => server.listen());

afterEach(() => {
  cleanup();
  afterEach(() => server.resetHandlers());
});

afterAll(() => server.close());
