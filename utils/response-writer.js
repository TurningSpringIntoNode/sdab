
const constants = require('../core/response-constants');

const goodResponse = (res, content) => {
  res
    .send({
      status: 'OK',
      message: 'OK',
      content,
    });
};

const badResponse = (res, status, message) => {
  res
    .status(status)
    .send({
      status: 'ERROR',
      message,
    });
};

const failedToComplete = res => () => badResponse(res, 500, constants.ERROR);

module.exports = {
  goodResponse,
  badResponse,
  failedToComplete,
};
