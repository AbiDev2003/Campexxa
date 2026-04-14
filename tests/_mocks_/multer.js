module.exports = () => ({
  single: () => (req, res, next) => {
    req.file = { path: "test.jpg", filename: "test.jpg" };
    if (!req.body) req.body = {};
    next();
  },
  array: () => (req, res, next) => {
    req.files = [
      { path: "test.jpg", filename: "test.jpg" }
    ];
    if (!req.body) req.body = {};
    next();
  }, 
  fields: () => (req, res, next) => {
    req.files = [{ path: "test.jpg", filename: "test.jpg" }];
    if (!req.body) req.body = {};
    next();
  }
});

module.exports.diskStorage = jest.fn();
module.exports.memoryStorage = jest.fn();