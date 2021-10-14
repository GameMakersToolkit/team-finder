import 'whatwg-fetch';
import { server } from "./test-utils/api-mocks/server-jest";

jest.mock("./utils/importMeta");

// Establish API mocking before all tests.
beforeAll(() =>
  server.listen({
    onUnhandledRequest: "error",
  })
);
// Reset any request handlers that we may add during the tests,
// so they don't affect other tests.
afterEach(() => server.resetHandlers());
// Clean up after the tests are finished.
afterAll(() => server.close());

export {};
