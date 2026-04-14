const request = require("supertest");
const app = require("../../app");
const User = require("../../models/user");
const Campground = require("../../models/campground");
const Review = require("../../models/review");

describe("Review Routes", () => {

  let campground;

  // 🔥 Create a campground before tests
  beforeEach(async () => {
    campground = await Campground.create({
      title: "Test Camp",
      price: 100,
      location: "Test Location", 
      geometry: {
        type: "Point",
        coordinates: [0, 0]
    }
    });
  });

  // ✅ PUBLIC ROUTE
  test("GET /campgrounds/:campId/reviews should load", async () => {
    const res = await request(app).get(`/campgrounds/${campground._id}/reviews`);
    expect(res.statusCode).toBe(200);
  });

  // ❌ POST without login
  test("POST /campgrounds/:campId/reviews should fail if not logged in", async () => {
    const res = await request(app)
      .post(`/campgrounds/${campground._id}/reviews`)
      .send({
        review: {
          rating: 5,
          body: "Great place!"
        }
      });

    expect(res.statusCode).toBe(302); // redirect to login
  });

  // ✅ POST with login
  test("POST /campgrounds/:campId/reviews should create review", async () => {
    const agent = request.agent(app);

    // 👤 Create user
    await User.register(
      new User({
        username: "reviewUser",
        email: "review@test.com",
        fullName: "Review User"
      }),
      "Password@123"
    );

    // 🔐 Login
    await agent
      .post("/login")
      .type("form")
      .send({
        username: "reviewUser",
        password: "Password@123"
      });

    // ✍️ Create review
    const res = await agent
      .post(`/campgrounds/${campground._id}/reviews`)
      .send({
        review: {
          rating: 5,
          body: "Amazing experience!"
        }
      });

    expect(res.statusCode).toBe(302);

    const reviews = await Review.find({});
    expect(reviews.length).toBe(1);
    expect(reviews[0].body).toBe("Amazing experience!");
  });

});

describe('Review Protected Routes', () => {
  let agent;
  let user;
  let campground;
  let review;

  beforeEach(async () => {
    agent = request.agent(app);

    // 👤 create user
    user = await User.register(
      new User({
        username: "reviewOwner",
        email: "reviewOwner@test.com",
        fullName: "Review Owner"
      }),
      "Password@123"
    );

    // 🔐 login
    await agent
      .post("/login")
      .type("form")
      .send({
        username: "reviewOwner",
        password: "Password@123"
      });

    // 🏕️ create campground
    campground = await Campground.create({
      title: "Test Camp",
      price: 100,
      location: "Test Location",
      geometry: {
        type: "Point",
        coordinates: [0, 0]
      },
      auther: user._id
    });

    // ✍️ create review
    review = await Review.create({
      rating: 5,
      body: "Nice place",
      auther: user._id,
      campground: campground._id
    });

    campground.reviews.push(review);
    await campground.save();
  });

  // 🔥 ADD REVIEW PAGE
  test("GET /campgrounds/:id/reviews/addReview should load for logged-in user", async () => {
    const res = await agent.get(`/campgrounds/${campground._id}/reviews/addReview`);
    expect(res.statusCode).toBe(200);
  });

  // 🔥 EDIT REVIEW
  test("GET /campgrounds/:id/reviews/:reviewId/edit should allow owner", async () => {
    const res = await agent.get(
      `/campgrounds/${campground._id}/reviews/${review._id}/edit`
    );
    expect(res.statusCode).toBe(200);
  });

  // 🔥 UPDATE REVIEW
  test("PUT /campgrounds/:id/reviews/:reviewId should update review", async () => {
    const res = await agent
      .put(`/campgrounds/${campground._id}/reviews/${review._id}`)
      .send({
        review: {
          rating: 3,
          body: "Updated review"
        }
      });

    expect(res.statusCode).toBe(302);

    const updated = await Review.findById(review._id);
    expect(updated.body).toBe("Updated review");
  });

  // 🔥 DELETE REVIEW
  test("DELETE /campgrounds/:id/reviews/:reviewId should delete review", async () => {
    const res = await agent.delete(
      `/campgrounds/${campground._id}/reviews/${review._id}`
    );

    expect(res.statusCode).toBe(302);

    const deleted = await Review.findById(review._id);
    expect(deleted).toBeNull();
  });
})