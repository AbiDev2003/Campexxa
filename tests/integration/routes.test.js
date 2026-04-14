// jest.mock('@mapbox/mapbox-sdk/services/geocoding', () =>
//   require('../_mocks_/mapbox')
// );

// jest.mock('../../cloudinary', () =>
//   require('../_mocks_/cloudinary')
// );

// jest.mock('multer', () =>
//   require('../_mocks_/multer')
// );

const request = require("supertest");
const app = require("../../app");

describe("Public Routes", () => {
  test("GET / should load home page", async () => {
    const res = await request(app).get("/");
    expect(res.statusCode).toBe(200);
  });

  test("GET /campgrounds should load index", async () => {
    const res = await request(app).get("/campgrounds");
    expect(res.statusCode).toBe(200);
  });

  test("GET /campgrounds/:id should handle invalid ID", async () => {
    const res = await request(app).get("/campgrounds/123");
    expect(res.statusCode).toBeGreaterThanOrEqual(400);
  });

  test("GET /campgrounds/:id/reviews should handle invalid ID", async () => {
    const res = await request(app).get("/campgrounds/123");
    expect(res.statusCode).toBeGreaterThanOrEqual(400);
  });

  test("GET /login should load login page", async () => {
    const res = await request(app).get("/login");
    expect(res.statusCode).toBe(200);
  });

  test("GET /register should load register page", async () => {
    const res = await request(app).get("/register");
    expect(res.statusCode).toBe(200);
  });

  test("GET /privacy-policy should load page", async () => {
    const res = await request(app).get("/privacy-policy");
    expect(res.statusCode).toBe(200);
  });
});
