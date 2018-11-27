const responseWriter = require('../utils/response-writer');
const constants = require('../core/response-constants');

const addPagination = (req, res, next) => {
  const pagination = {
    skip: 0,
    limit: 20,
  };

  const { page, pageSize } = req.query;

  if (page && Number.isNaN(page)) {
    responseWriter.badResponse(res, 400, constants.PAGE_NOT_NUMBER);
  } else if (pageSize && Number.isNaN(pageSize)) {
    responseWriter.badResponse(res, 400, constants.PAGE_SIZE_NOT_NUMBER);
  } else if (pageSize && (pageSize < 1 || pageSize > 30)) {
    responseWriter.badResponse(res, 400, constants.PAGE_SIZE_BAD_RANGE);
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
