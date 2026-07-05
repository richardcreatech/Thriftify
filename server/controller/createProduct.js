const { Sellers, Markets } = require("../model/db");
const { uploadImageToS3 } = require("../utils/putObject");

const createProduct = async (req, res) => {
  // console.log(req.body)
  // console.log(req.file.originalname)
  // console.log(req.file.mimetype)
  // console.log(req.file.size)
  try {
    const { marketId } = req.params;
    const { name, category, price, quantity } = req.body;

    const seller = await Sellers.findOne({
      user_id: req.user.id,
    });

    if (!seller) {
      return res.status(404).json({
        success: false,
        message: "Seller not found.",
      });
    }

    const market = await Markets.findById(marketId);

    if (!market) {
      return res.status(404).json({
        success: false,
        message: "Marketplace not found.",
      });
    }

    // Ensure the seller owns this marketplace
    if (market.owner.toString() !== seller._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to add products to this marketplace.",
      });
    }

    // const randomImage =
    //   productImages[Math.floor(Math.random() * productImages.length)];

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please upload a product image.",
      });
    }

    const uploadResult = await uploadImageToS3(req.file);

    if (!uploadResult) {
      return res.status(500).json({
        success: false,
        message: "Failed to upload image.",
      });
    }

    const { url } = uploadResult;

    const newProduct = {
      name,
      category,
      price,
      quantity,
      imageURL: url,
    };

    market.products.push(newProduct);

    seller.total_products += 1;

    await market.save();
    await seller.save();

    return res.status(201).json({
      success: true,
      message: "Product created successfully.",
      product: market.products[market.products.length - 1],
      products: market.products,
      market,
    });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      success: false,
      message: "Something went wrong.",
    });
  }
};

module.exports = { createProduct };
