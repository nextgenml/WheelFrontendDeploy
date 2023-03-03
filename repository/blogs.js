const { runQueryAsync } = require("../utils/spinwheelUtil");

const getCustomBlogs = async (walletId, isAdmin, search, pageSize, offset) => {
  const query =
    "select * from saved_prompts where (1 = ? or wallet_address = ?) and (1 = ? or wallet_address = ?) and initiative = ? order by id desc limit ? offset ?";

  return await runQueryAsync(query, [
    isAdmin ? 1 : 0,
    walletId,
    search ? 0 : 1,
    search,
    "blog-customization",
    pageSize,
    offset,
  ]);
};

module.exports = {
  getCustomBlogs,
};
