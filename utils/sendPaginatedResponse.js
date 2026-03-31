const renderPartial = require('./renderPartial');

module.exports.sendPaginatedResponse = async ({ req, res, view, dataKey, data, hasMore }) => {
  if (req.xhr || req.headers.accept.includes('application/json')) {
    const html = await renderPartial(req, res, view, { [dataKey]: data });
    return res.json({ html, hasMore });
  }
  return null;
};