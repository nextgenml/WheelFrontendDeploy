const promotionsRepo = require("../repository/promotions");
const blogsRepo = require("../repository/blogs");

const getPromotedBlogs = async (walletId) => {
  const eligibleWallets = await promotionsRepo.eligibleWallets(walletId);
  return await blogsRepo.getPromotedBlogs(eligibleWallets, walletId);
};

module.exports = {
  getPromotedBlogs,
};
