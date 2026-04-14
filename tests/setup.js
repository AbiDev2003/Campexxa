jest.mock('@mapbox/mapbox-sdk/services/geocoding', () =>
  require('./_mocks_/mapbox')
);

jest.mock('../cloudinary', () =>
  require('./_mocks_/cloudinary')
);

jest.mock('multer', () =>
  require('./_mocks_/multer')
);

jest.mock("resend", () => (
  require('./_mocks_/resend')
));


process.env.NODE_ENV = "test";
process.env.MAPBOX_TOKEN="test-token";
process.env.SESSION_SECRET="test-secret";
process.env.GOOGLE_CLIENT_ID="google-test-id";
process.env.GOOGLE_CLIENT_SECRET="google-test-secret";
process.env.GITHUB_CLIENT_ID="github-test-id";
process.env.GITHUB_CLIENT_SECRET="github-test-secret";
process.env.FACEBOOK_CLIENT_ID="facebook-test-id";
process.env.FACEBOOK_CLIENT_SECRET="facebook-test-secret";

const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");

let mongo;

beforeAll(async () => {
  mongo = await MongoMemoryServer.create();
  const uri = mongo.getUri();
  await mongoose.connect(uri);
});

afterEach(async () => {
  const collections = mongoose.connection.collections;
  for (let key in collections) {
    await collections[key].deleteMany();
  }
});

afterAll(async () => {
  await mongoose.connection.close();
  await mongo.stop();
});