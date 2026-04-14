module.exports = {
  cloudinary: {
    uploader: {
      destroy: jest.fn(),
      upload: jest.fn().mockResolvedValue({
        url: "test.jpg",
        public_id: "test"
      })
    }
  },
  storage: {}
};