const { User } = require("../model/db");
const jwt = require("jsonwebtoken");
// const bcrypt = require("bcrypt");

const sign_in = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "Account not found.",
    });
  }

  const isMatch = password == user.password;
  // const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    return res.status(401).json({
      success: false,
      message: "Incorrect password.",
    });
  }

  const token = jwt.sign(
    {
      id: user._id,
      role: user.role,
    },
    "secret_word",
    {
      expiresIn: "7d",
    },
  );
    

  return res.status(200).json({
    success: true,
    message: "Login successful.",
    token,
});


};

module.exports = { sign_in };
