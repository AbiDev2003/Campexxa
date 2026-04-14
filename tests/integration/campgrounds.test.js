const request = require("supertest");
const app = require("../../app");
const User = require("../../models/user");
const Campground = require("../../models/campground");

describe("Campground Routes", () => {

  // ❌ Protected route without login
  test("GET /campgrounds/new should redirect if not logged in", async () => {
    const res = await request(app).get("/campgrounds/new");
    expect(res.statusCode).toBe(302);
  });

  // ✅ Protected route with login
  test("GET /campgrounds/new should work after login", async () => {
    const agent = request.agent(app);

    await User.register(
      new User({
        username: "campUser",
        email: "camp@test.com",
        fullName: "Camp User"
      }),
      "Password@123"
    );

    await agent
      .post("/login")
      .type("form")
      .send({
        username: "campUser",
        password: "Password@123"
      });

    const res = await agent.get("/campgrounds/new");

    expect(res.statusCode).toBe(200);
  });

  // ❌ POST without login
  test("POST /campgrounds should fail if not logged in", async () => {
    const res = await request(app)
      .post("/campgrounds")
      .send({
        campground: {
          title: "Test Camp",
          price: 100,
          location: "Test"
        }
      });

    expect(res.statusCode).toBe(302);
  });

});

// post routes testing ****************************************
describe("Campground POST", () => {

  test("POST /campgrounds should create campground (logged in)", async () => {
    const agent = request.agent(app);

    // 👤 Create user
    await User.register(
      new User({
        username: "postUser",
        email: "post@test.com",
        fullName: "Post User"
      }),
      "Password@123"
    );

    // 🔐 Login
    await agent
      .post("/login")
      .type("form")
      .send({
        username: "postUser",
        password: "Password@123"
      });

    // change to JSON
    const res = await agent
      .post("/campgrounds")
      .send({
        campground: {
          title: "Test Camp",
          price: 100,
          location: "Test Location",
          description: "Test description"
        }
      });

    expect(res.statusCode).toBe(302);

    const camps = await Campground.find({});
    expect(camps.length).toBe(1);
    expect(camps[0].title).toBe("Test Camp");
  });
});


// edit, update, delete routes testing ****************************************
describe("Campgroound Protected Actions", () => {
  let agent; 
  let user; 
  let campground; 

  beforeEach(async() => {
    agent = request.agent(app);
    // create new user
    user = await User.register(
      new User({
        username: "owner", 
        email: "owner@test.com", 
        fullName: "Owner User"
      }),
      "Password@123" 
    ); 

    // login the user
    await agent
      .post('/login')
      .type('form')
      .send({
        username: "owner", 
        password: "Password@123"
      })

    // create campground directly in DB
    campground = await Campground.create({
      title: "Test Camp", 
      price: 100, 
      location: "Test Location", 
      geometry: {
        type: "Point", 
        coordinates: [0, 0]
      }, 
      auther: user._id
    })
  })


  // edit route blocked for non user
  test("GET /campgrounds/:id/edit should block non owner", async () => {
    const otherAgent = request.agent(app);
    // create new user
    await User.register(
      new User({
        username: "other", 
        email: "other@test.com", 
        fullName: "Other User"
      }),
      "Password@123" 
    ); 

    // login the user
    await otherAgent
      .post('/login')
      .type('form')
      .send({
        username: "other", 
        password: "Password@123"
      })

    const res = await otherAgent.get(`/campgrounds/${campground._id}/edit`); 
    expect(res.statusCode).toBe(302); 
  });

  // edit route allowed for owner user
  test("GET /campgrounds/:id/edit should allow the user", async () => {
    const res = await agent.get(`/campgrounds/${campground._id}/edit`); 
    expect(res.statusCode).toBe(200); 
  })

  // update (PUT)
  test("PUT /campgrounds/:id should update campground for owner", async () => {
    const res = await agent
      .put(`/campgrounds/${campground._id}`)
      .send({
        campground: {
          title: "Updated Camp", 
          price: 200, 
          location: "Updated Location", 
          description: "Updated desc"
        }
      })
    
    expect(res.statusCode).toBe(302); 
    
    const updated = await Campground.findById(campground._id)
    expect(updated.title).toBe("Updated Camp");
  })

  // delete
  test("DELETE /campgrounds/:id should delete campground for owner", async () => {
    const res = await agent.delete(`/campgrounds/${campground._id}`).send({});
    expect(res.statusCode).toBe(302); 

    const deleted = await Campground.findById(campground._id)
    expect(deleted).toBeNull();
  })

}); 