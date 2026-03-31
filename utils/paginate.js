module.exports.getPagination = (req, defaultLimit = 6) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || defaultLimit; 
  const skip = (page - 1) * limit;

  return { page, limit, skip };
};

module.exports.getHasMore = (total, currentCount, skip) => {
  return skip + currentCount < total;
};