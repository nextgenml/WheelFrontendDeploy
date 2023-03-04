const { runQueryAsync } = require("../utils/spinwheelUtil");

const getCustomBlogs = async (walletId, isAdmin, search, pageSize, offset) => {
  const query =
    "select * from saved_prompts where (1 = ? or wallet_address = ?) and (1 = ? or wallet_address = ?) and initiative = ? order by id desc limit ? offset ?";

  const data = await runQueryAsync(query, [
    isAdmin ? 1 : 0,
    walletId,
    search ? 0 : 1,
    search,
    "blog-customization",
    pageSize,
    offset,
  ]);

  const countQuery =
    "select count(1) as count from saved_prompts where (1 = ? or wallet_address = ?) and (1 = ? or wallet_address = ?) and initiative = ?";
  const data1 = await runQueryAsync(countQuery, [
    isAdmin ? 1 : 0,
    walletId,
    search ? 0 : 1,
    search,
    "blog-customization",
  ]);

  return [data1[0].count, data];
};

const getPromotedBlogs = async (promotedWallets, walletId) => {
  if (!promotedWallets.length) return [[], 0];
  const query2 =
    "select promoted_blog_id from saved_prompts where wallet_address = ?";
  const data2 = await runQueryAsync(query2, [walletId]);
  const promotedIds = [...data2.map((x) => x.promoted_blog_id), -1];
  console.log("promotedIds", promotedIds);

  const query =
    "select * from saved_prompts where wallet_address in (?) and initiative = ? and promoted = 1 and id not in (?) limit 10";
  const data = await runQueryAsync(query, [
    promotedWallets,
    "blog-customization",
    promotedIds,
  ]);
  const query1 =
    "select count(1) as count from saved_prompts where wallet_address in (?) and initiative = ? and promoted = 1 and id not in (?)";
  const data1 = await runQueryAsync(query1, [
    promotedWallets,
    "blog-customization",
    promotedIds,
  ]);
  return [data, data1[0].count];
};
module.exports = {
  getCustomBlogs,
  getPromotedBlogs,
};
