const { sendPaginatedResponse } = require("../../utils/sendPaginatedResponse");

describe("sendPaginatedResponse", () => {
  test("returns paginated response structure", async () => {
    const mockRes = {
      json: jest.fn(),
      render: jest.fn((view, data, cb) => cb(null, "<html></html>"))
    };

    const mockReq = {
      xhr: true,
      headers: { accept: "application/json" },
    };

    await sendPaginatedResponse({
      req: mockReq,
      res: mockRes,
      view: "test",
      dataKey: "data",
      data: [1, 2],
      hasMore: true
    });

    expect(mockRes.json).toHaveBeenCalledWith(
      expect.objectContaining({
        html: expect.any(String),
        hasMore: true
      }),
    );
  });
});
