module.exports = (req, res, view, data) => {
  return new Promise((resolve, reject) => {
    res.render(view, data, (err, html) => {  // ✅ res.render, not req.app.render
      if (err) {
        console.error('renderPartial error:', err); // ✅ see exact error
        reject(err);
      } else {
        resolve(html);
      }
    });
  });
};