const request = require("supertest");
const app = require("../../app");
const User = require("../../models/user");

describe("Auth Routes", () => {

  const testUser = {
    username: "testuser",
    email: "test@example.com",
    fullName: "Test User",
    password: "Password@123"
  };

  // ✅ Register
  test("POST /register should create user", async () => {
    const res = await request(app)
      .post("/register")
      .send(testUser);

    expect(res.statusCode).toBe(302); // redirect
  });

  // ✅ Login success
  test("POST /login should login user", async () => {
    await User.register(
      new User({
        username: testUser.username,
        email: testUser.email,
        fullName: testUser.fullName
      }),
      testUser.password
    );

    const res = await request(app)
      .post("/login")
      .send({
        username: testUser.username,
        password: testUser.password
      });

    expect(res.statusCode).toBe(302);
  });

  // ❌ Login fail
  test("POST /login should fail with wrong credentials", async () => {
    const res = await request(app)
      .post("/login")
      .send({
        username: "wrong",
        password: "wrong"
      });

    expect(res.statusCode).toBe(302); // redirect back
  });

  // 🔥 Protected route without login
  test("GET /campgrounds/new should redirect if not logged in", async () => {
    const res = await request(app).get("/campgrounds/new");

    expect(res.statusCode).toBe(302);
  });

  // 🔥 Protected route WITH login (session test)
  test("GET /campgrounds/new should work after login", async () => {
    const agent = request.agent(app);

    await User.register(
      new User({
        username: "agentUser",
        email: "agent@test.com",
        fullName: "Agent User"
      }),
      "Password@123"
    );

    await agent
      .post("/login")
      .type("form")
      .send({
        username: "agentUser",
        password: "Password@123"
      });

    const res = await agent.get("/campgrounds/new");

    expect(res.statusCode).toBe(200);
  });

});


// forgot password actions ********************************
describe("Forgot Password", () => {

  let user;

  beforeEach(async () => {
    user = await User.register(
      new User({
        username: "forgotUser",
        email: "forgot@test.com",
        fullName: "Forgot User"
      }),
      "Password@123"
    );
  });

  // GET page
  test("GET /forgot-password should load", async () => {
    const res = await request(app).get("/forgot-password");
    expect(res.statusCode).toBe(200);
  });

  // POST (valid email)
  test("POST /forgot-password should handle request", async () => {
    const res = await request(app)
      .post("/forgot-password")
      .send({ email: "forgot@test.com" });

    expect(res.statusCode).toBe(302);

    const updatedUser = await User.findById(user._id);
    expect(updatedUser.resetPasswordToken).toBeDefined();
  });

});

// reset password actions ********************************
describe("Reset Password", () => {

  let user;
  let rawToken;

  beforeEach(async () => {
    user = await User.register(
      new User({
        username: "resetUser",
        email: "reset@test.com",
        fullName: "Reset User"
      }),
      "Password@123"
    );

    // 🔥 manually create token (same as controller logic)
    const crypto = require("crypto");

    rawToken = "testtoken";
    const hashed = crypto.createHash("sha256").update(rawToken).digest("hex");

    user.resetPasswordToken = hashed;
    user.resetPasswordExpires = Date.now() + 1000000;
    await user.save();
  });

  // GET reset form
  test("GET /reset/:token should load", async () => {
    const res = await request(app).get(`/reset/${rawToken}`);
    expect(res.statusCode).toBe(200);
  });

  // POST reset
  test("POST /reset/:token should update password", async () => {
    const res = await request(app)
      .post(`/reset/${rawToken}`)
      .send({
        password: "NewPass@123",
        confirmPassword: "NewPass@123"
      });

    expect(res.statusCode).toBe(302);

    const updatedUser = await User.findById(user._id);
    expect(updatedUser.resetPasswordToken).toBeUndefined();
  });

});

// skip reset actions if token invalid/expired (covered in GET and POST tests above)
test("GET /reset/:token/skip should login user", async () => {
  const crypto = require("crypto");

  const user = await User.register(
    new User({
      username: "skipUser",
      email: "skip@test.com",
      fullName: "Skip User"
    }),
    "Password@123"
  );

  const rawToken = "skiptoken";
  const hashed = crypto.createHash("sha256").update(rawToken).digest("hex");

  user.resetPasswordToken = hashed;
  user.resetPasswordExpires = Date.now() + 1000000;
  await user.save();

  const res = await request(app).get(`/reset/${rawToken}/skip`);

  expect(res.statusCode).toBe(302);
});

// logout action test
test("GET /logout should logout user", async () => {
  const agent = request.agent(app);

  await User.register(
    new User({
      username: "logoutUser",
      email: "logout@test.com",
      fullName: "Logout User"
    }),
    "Password@123"
  );

  await agent
    .post("/login")
    .type("form")
    .send({
      username: "logoutUser",
      password: "Password@123"
    });

  const res = await agent.get("/logout");

  expect(res.statusCode).toBe(302);
});