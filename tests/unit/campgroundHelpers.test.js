const { computeRating, attachRatings } = require("../../utils/campgroundHelpers");

describe("Campground Helpers", () => {
  test("computeRating returns average rating", () => {
    const reviews = [{ rating: 4 }, { rating: 5 }];
    expect(computeRating({reviews}).avgRating).toBe("4.5");
  });

  test("computeRating returns 0 if no reviews", () => {
    expect(computeRating({ reviews: [] }).avgRating).toBe(0);
  });

  test("attachRatings adds rating field", () => {
    const camps = [
      { reviews: [{ rating: 4 }, { rating: 2 }] }
    ];

    const result = attachRatings(camps);
    expect(result[0].avgRating).toBe("3.0");
  });
});