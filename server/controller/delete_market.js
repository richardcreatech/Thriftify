
const pool = require("../model/db");

const delete_market = async (req, res) => {
  const client = await pool.connect();

  try {
    const { marketId } = req.params;
    const userId = req.user.id;

    await client.query("BEGIN");

    // 1. Find the seller
    const sellerResult = await client.query(
      "SELECT id FROM sellers WHERE user_id = $1",
      [userId]
    );

    const seller = sellerResult.rows[0];

    if (!seller) {
      await client.query("ROLLBACK");

      return res.status(404).json({
        success: false,
        message: "Seller not found.",
      });
    }

    // 2. Check marketplace ownership
    const marketResult = await client.query(
      `SELECT id
       FROM markets
       WHERE id = $1 AND owner_id = $2`,
      [marketId, seller.id]
    );

    if (marketResult.rows.length === 0) {
      const existsResult = await client.query(
        "SELECT id FROM markets WHERE id = $1",
        [marketId]
      );

      await client.query("ROLLBACK");

      if (existsResult.rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Marketplace not found.",
        });
      }

      return res.status(403).json({
        success: false,
        message: "You are not allowed to delete this marketplace.",
      });
    }

    // 3. Delete the marketplace
    await client.query(
      `DELETE FROM markets
       WHERE id = $1 AND owner_id = $2`,
      [marketId, seller.id]
    );

    // 4. Fetch the seller's remaining marketplaces
    const marketsResult = await client.query(
      `SELECT *
       FROM markets
       WHERE owner_id = $1
       ORDER BY created_at DESC, id DESC`,
      [seller.id]
    );

    await client.query("COMMIT");

    return res.status(200).json({
      success: true,
      message: "Marketplace deleted successfully.",
      sellers_market: marketsResult.rows,
    });
  } catch (error) {
    await client.query("ROLLBACK");

    console.error("Delete marketplace error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong.",
    });
  } finally {
    client.release();
  }
};

module.exports = { delete_market };
