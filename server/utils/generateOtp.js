const { randomInt } = require("crypto");

const generateOtp = async (length = 6) => {
  const otp = Array.from({ length }, () => randomInt(0, 10)).join("");

  return `thrift-${otp}`;
};

module.exports = { generateOtp };
