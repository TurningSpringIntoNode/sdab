
const addPagination = (req, res, next) => {
  const pagination = {
    skip: 0,
    limit: 20,
  };

  const { page, pageSize } = req.query;

  if (page && Number.isNaN(page)) {
    res
      .status(400)
      .send({
        status: 'ERROR',
        message: 'Page is not a number',
      });
  } else if (pageSize && Number.isNaN(pageSize)) {
    res
      .status(400)
      .send({
        status: 'ERROR',
        message: 'Page size is not a number',
      });
  } else {
    if (pageSize) {
      pagination.limit = 1 * pageSize;
    }
    if (page) {
      pagination.skip = (page - 1) * pagination.limit;
    }
    req.pagination = pagination;
    next();
  }
};

module.exports = {
  addPagination,
};
