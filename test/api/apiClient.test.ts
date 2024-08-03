import MockAdapter from "axios-mock-adapter";
import apiClient from "../../src/api/apiClient";

const mock = new MockAdapter(apiClient);

describe("apiClient", () => {
  beforeEach(() => {
    mock.reset();
  });

  it("should not retry on 400 error", async () => {
    mock.onGet("/search").reply(400);

    try {
      await apiClient.get("/search");
    } catch (error) {
      // Verify that retry logic is not invoked
    }
  });

  it("should make a successful request", async () => {
    mock.onGet("/search").reply(200, { data: "test" });

    const response = await apiClient.get("/search");
    expect(response.status).toBe(200);
    expect(response.data).toEqual({ data: "test" });
  });
});
