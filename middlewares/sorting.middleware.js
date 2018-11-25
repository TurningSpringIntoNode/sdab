
const addSorting = (validFields, validOrders, defaultSort) => {

  /**
   * {
   *   defaultSort: {
   *     sortBy,
   *     order
   *   }
   * }
   */

  return (req, res, next) => {
    const sorting = defaultSort;
    const { sortBy, order } = req.query;

    if (sortBy) {
      if (validFields.includes(sortBy)) {
        sorting.sortBy = sortBy;
      } else {
        return res
          .status(400)
          .send({
            status: 'ERROR',
            message: `${sortBy} is not a valid field for sorting. ${validFields.join(' ')} is/are available.`,
          });
      }
    }

    if (order) {
      if (validOrders.includes(order)) {
        sorting.order = order;
      } else {
        return res
          .status(400)
          .send({
            status: 'ERROR',
            message: `${order} is not a valid option for sorting order. ${validOrders.join(' ')} is/are available`,
          });
      }
    }

    req.sorting = sorting;
    next();
    return;
  };
};

module.exports = {
  addSorting
};