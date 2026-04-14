const request = require("supertest");
const app = require("../../app");
const User = require("../../models/user");
const Campground = require("../../models/campground");
const Review = require("../../models/review");

describe("Dashboard Routes", () => {

  let agent;
  let user;
  
  beforeEach(async () => {
    agent = request.agent(app);

    // 👤 create user
    user = await User.register(
      new User({
        username: "dashUser",
        email: "dash@test.com",
        fullName: "Dash User"
      }),
      "Password@123"
    );

    // 🔐 login
    await agent
      .post("/login")
      .type("form")
      .send({
        username: "dashUser",
        password: "Password@123"
      });
  });

  // dashboard load ******************************************************

  test("GET /dashboard should redirect if not logged in", async () => {
    const res = await request(app).get("/dashboard");
    expect(res.statusCode).toBe(302);
  });

  test("GET /dashboard should load for logged-in user", async () => {
    const res = await agent.get("/dashboard");
    expect(res.statusCode).toBe(200);
  });

  // 4 tabs ******************************************************

  test("GET /dashboard?tab=campgrounds", async () => {
    const res = await agent.get("/dashboard?tab=campgrounds");
    expect(res.statusCode).toBe(200);
  });

  test("GET /dashboard?tab=saved", async () => {
    const res = await agent.get("/dashboard?tab=saved");
    expect(res.statusCode).toBe(200);
  });

  test("GET /dashboard?tab=reviews", async () => {
    const res = await agent.get("/dashboard?tab=reviews");
    expect(res.statusCode).toBe(200);
  });
  test("GET /dashboard?tab=profile", async () => {
    const res = await agent.get("/dashboard?tab=profile");
    expect(res.statusCode).toBe(200);
  });

});


// dashboard actions (delete, unsave, profile update) ********************************

describe("Dashboard Actions", () => {

  let agent;
  let user;
  let campground;

  beforeEach(async () => {
    agent = request.agent(app);

    user = await User.register(
      new User({
        username: "actionUser",
        email: "action@test.com",
        fullName: "Action User"
      }),
      "Password@123"
    );

    await agent
      .post("/login")
      .type("form")
      .send({
        username: "actionUser",
        password: "Password@123"
      });

    // create camp
    campground = await Campground.create({
      title: "Test Camp",
      price: 100,
      location: "Test",
      geometry: { type: "Point", coordinates: [0, 0] },
      auther: user._id
    });
  });

  // 🔥 delete selected
  test("POST /dashboard/delete-selected", async () => {
    const res = await agent
      .post("/dashboard/delete-selected")
      .send({ selectedIds: [campground._id] });

    expect(res.statusCode).toBe(302);

    const camps = await Campground.find({});
    expect(camps.length).toBe(0);
  });

  // 🔥 delete all
  test("POST /dashboard/delete-all", async () => {
    await agent.post("/dashboard/delete-all");

    const camps = await Campground.find({});
    expect(camps.length).toBe(0);
  });

});

// campgrounds unsave actions ********************************************
describe("Dashboard Unsave Actions", () => {

  let agent;
  let user;
  let campground;

  beforeEach(async () => {
    agent = request.agent(app);

    user = await User.register(
      new User({
        username: "unsaveUser",
        email: "unsave@test.com",
        fullName: "Unsave User"
      }),
      "Password@123"
    );

    await agent
      .post("/login")
      .type("form")
      .send({
        username: "unsaveUser",
        password: "Password@123"
      });

    // 🏕️ create campground
    campground = await Campground.create({
      title: "Saved Camp",
      price: 100,
      location: "Test",
      geometry: { type: "Point", coordinates: [0, 0] }
    });

    // 💾 add to saved
    user.savedCampgrounds.push(campground._id);
    await user.save();
  });

  // 🔥 unsave selected
  test("POST /dashboard/unsave-selected", async () => {
    const res = await agent
      .post("/dashboard/unsave-selected")
      .send({ selectedIds: [campground._id] });

    expect(res.statusCode).toBe(302);

    const updatedUser = await User.findById(user._id);
    expect(updatedUser.savedCampgrounds.length).toBe(0);
  });

  // 🔥 unsave all
  test("POST /dashboard/unsave-all", async () => {
    const res = await agent.post("/dashboard/unsave-all");

    expect(res.statusCode).toBe(302);

    const updatedUser = await User.findById(user._id);
    expect(updatedUser.savedCampgrounds.length).toBe(0);
  });

});


// REVIEW DELETE ********************************************

describe("Dashboard Review Delete", () => {

  let agent;
  let user;
  let campground;
  let review;

  beforeEach(async () => {
    agent = request.agent(app);

    user = await User.register(
      new User({
        username: "reviewDash",
        email: "reviewDash@test.com",
        fullName: "Review Dash"
      }),
      "Password@123"
    );

    await agent
      .post("/login")
      .type("form")
      .send({
        username: "reviewDash",
        password: "Password@123"
      });

    campground = await Campground.create({
      title: "Test Camp",
      price: 100,
      location: "Test",
      geometry: { type: "Point", coordinates: [0, 0] },
      auther: user._id
    });

    review = await Review.create({
      rating: 5,
      body: "Nice",
      auther: user._id,
      campground: campground._id
    });

    campground.reviews.push(review);
    await campground.save();
  });

  test("POST /dashboard/reviews/delete-all", async () => {
    const res = await agent.post("/dashboard/reviews/delete-all");

    expect(res.statusCode).toBe(302);

    const reviews = await Review.find({});
    expect(reviews.length).toBe(0);
  });

});

// profile actions ********************************************
describe("Dashboard Profile Update", () => {

  let agent;
  let user;

  beforeEach(async () => {
    agent = request.agent(app);

    user = await User.register(
      new User({
        username: "profileUser",
        email: "profile@test.com",
        fullName: "Profile User"
      }),
      "Password@123"
    );

    await agent
      .post("/login")
      .type("form")
      .send({
        username: "profileUser",
        password: "Password@123"
      });
  });

  test("POST /dashboard/profile/update should update profile", async () => {
    const res = await agent
      .post("/dashboard/profile/update")
      .send({
        username: "updatedUser",
        fullName: "Updated Name"
      });

    expect(res.statusCode).toBe(302);

    const updatedUser = await User.findById(user._id);
    expect(updatedUser.username).toBe("updatedUser");
    expect(updatedUser.fullName).toBe("Updated Name");
  });

});