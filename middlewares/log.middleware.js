const logIp = (req, res, next) => {
  console.log(`${req.ip} is requesting ${req.originalUrl}`);
  next();
};

module.exports = {
  logIp,
};
