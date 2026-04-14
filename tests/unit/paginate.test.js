const { getPagination, getHasMore } = require("../../utils/paginate");

describe("Pagination Utils", () => {
  test("getPagination returns correct limit & skip", () => {
    const req = {query: {page: "2", limit: "10"}};
    const result = getPagination(req);
    expect(result).toEqual({ page: 2, limit: 10, skip: 10 });
  });

  test("getHasMore returns true if more data exists", () => {
    expect(getHasMore(30, 2, 10)).toBe(true);
  });

  test("getHasMore returns false if no more data", () => {
    expect(getHasMore(20, 10, 10)).toBe(false);
  });
});