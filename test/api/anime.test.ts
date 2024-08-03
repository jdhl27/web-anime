// __tests__/anime.test.ts
import MockAdapter from "axios-mock-adapter";
import apiClient from "../../src/api/apiClient";
import { Data } from "../../src/types/data";
import { searchAnime } from "../../src/api/anime";
import { mockAnimes } from "../__mocks__/anime";

const mock = new MockAdapter(apiClient);

describe("searchAnime", () => {
  beforeEach(() => {
    mock.reset();
  });

  it("should return data on successful request", async () => {
    const mockData: Data = {
      total_pages: 10,
      avarage_score: 8.5,
      data: mockAnimes,
    };

    mock.onGet("/search").reply(200, mockData);

    const data = await searchAnime("Naruto");
    expect(data).toEqual(mockData);
  });

  it("should handle error correctly", async () => {
    mock.onGet("/search").reply(500);

    await expect(searchAnime("Naruto")).rejects.toThrow();
  });
});
