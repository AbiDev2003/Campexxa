module.exports = () => ({
  forwardGeocode: () => ({
    send: async () => ({
      body: {
        features: [
          {
            geometry: { type: "Point", coordinates: [0, 0] },
            context: [{ id: "country.1", short_code: "in" }]
          }
        ]
      }
    })
  })
});