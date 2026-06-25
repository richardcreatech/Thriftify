const { Sellers } = require("../model/db");

const get_seller_profile = async (req, res) => {
    console.log(req.user);
  const my_id = req.user.id;
  const seller = await Sellers.findOne({
     user_id: my_id
  });

  if (!seller) {
    return res.status(404).json({
      message: "Create a Seller Profile",
      success: false,
    });
  }

  return res.status(200).json({
    message: "Seller Profile Found",
    success: true,
    seller,
  });
};

module.exports = { get_seller_profile };
