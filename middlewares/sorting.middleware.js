const responseWriter = require('../utils/response-writer');
const constants = require('../core/response-constants');

const addSorting = (validFields, validOrders, defaultSort) => (req, res, next) => {
  const sorting = defaultSort;
  const { sortBy, order } = req.query;

  if (sortBy) {
    if (validFields.includes(sortBy)) {
      sorting.sortBy = sortBy;
    } else {
      return responseWriter.badResponse(res, 400, constants.INVALID_SORT_OPTIONS(sortBy, 'sorting field', validFields));
    }
  }

  if (order) {
    if (validOrders.includes(order)) {
      sorting.order = order;
    } else {
      return responseWriter.badResponse(res, 400, constants.INVALID_SORT_OPTIONS(order, 'sorting order', validFields));
    }
  }

  req.sorting = sorting;
  return next();
};
module.exports = {
  addSorting,
};
