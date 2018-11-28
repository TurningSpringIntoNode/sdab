const responseWriter = require('../utils/response-writer');
const constants = require('../core/response-constants');

const addPagination = (req, res, next) => {
  const pagination = {
    skip: 0,
    limit: 20,
  };

  const { page, pageSize } = req.query;

  if (page && Number.isNaN(1 * page)) {
    responseWriter.badResponse(res, 400, constants.PAGE_NOT_NUMBER);
  } else if (pageSize && Number.isNaN(1 * pageSize)) {
    responseWriter.badResponse(res, 400, constants.PAGE_SIZE_NOT_NUMBER);
  } else if (pageSize && (1 * pageSize < 1 || 1 * pageSize > 30)) {
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
