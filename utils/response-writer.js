
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

module.exports = {
  goodResponse,
  badResponse,
};