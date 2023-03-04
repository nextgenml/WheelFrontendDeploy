const { runQueryAsync } = require("../utils/spinwheelUtil");

const savePromotion = async (data) => {
  const query = `insert into promotion_requests (receiver_wallet_id, payer_wallet_id, overall_promotions_limit, blogs_limit, eth_amount, mark_as_done_by_user, status) values(?, ?, ?, ?, ?, ?, ?);`;

  return await runQueryAsync(query, [
    data.receiver_wallet_id,
    data.payer_wallet_id,
    data.overall_promotions_limit,
    data.blogs_limit,
    data.eth_amount,
    0,
    "requested",
  ]);
};

const updatePromotionAdmin = async (data) => {
  const query = `update promotion_requests set status = ?, reason = ? where id = ?;`;

  return await runQueryAsync(query, [data.status, data.reason, data.requestId]);
};
const updatePromotion = async (id, wallet_id) => {
  const query = `update promotion_requests set mark_as_done_by_user = ? where id = ? and payer_wallet_id = ?;`;

  return await runQueryAsync(query, [1, id, wallet_id]);
};
const getAppliedPromotions = async (walletId, pageSize, offset) => {
  const query = `select * from promotion_requests where payer_wallet_id = ? order by id desc limit ? offset ?;`;

  const data = await runQueryAsync(query, [walletId, pageSize, offset]);

  const query1 = `select count(1) as count from promotion_requests where payer_wallet_id = ?`;
  const count = await runQueryAsync(query1, [walletId]);

  return [data, count[0].count];
};

const getAppliedPromotionsAdmin = async (pageSize, offset) => {
  const query = `select * from promotion_requests where status = 'requested' and mark_as_done_by_user = 1 order by id desc limit ? offset ?;`;

  const data = await runQueryAsync(query, [pageSize, offset]);

  const query1 = `select count(1) as count from promotion_requests where status = 'requested'  and mark_as_done_by_user = 1`;
  const count = await runQueryAsync(query1);

  return [data, count[0].count];
};

const isEligibleForBlogs = async (walletId) => {
  const query = `select sum(blogs_limit) as count from promotion_requests where payer_wallet_id = ? and status = 'approved';`;

  const data = await runQueryAsync(query, [walletId]);
  const totalCount = data[0].count;

  // console.log("totalCount", totalCount);
  if (totalCount <= 0)
    return [false, "Unauthorized. Please apply for promotions first"];
  const query1 = `select count(1) as count from saved_prompts where wallet_address = ? and initiative = ?`;
  const data1 = await runQueryAsync(query1, [walletId, "blog-customization"]);
  const usedCount = data1[0].count;

  // console.log("usedCount", usedCount);
  if (usedCount >= totalCount)
    return [false, "Unauthorized. You are exhausted the limit"];
  return [true, ""];
};

const eligibleWallets = async (walletId) => {
  const eligibleCount = await runQueryAsync(
    "select payer_wallet_id, sum(overall_promotions_limit) as count from promotion_requests where payer_wallet_id != ? group by payer_wallet_id",
    [walletId]
  );
  console.log("eligibleCount", eligibleCount);
  const promotedCount = await runQueryAsync(
    "select promoted_wallet, count(1) as count  from saved_prompts where initiative = 'promote-blogs' and promoted_wallet != ? group by promoted_wallet",
    [walletId]
  );
  console.log("promotedCount", promotedCount);
  const result = [];
  for (var e of eligibleCount) {
    var found = false;
    for (var p of promotedCount)
      if (e.payer_wallet_id === p.promoted_wallet)
        if (e.count > p.count) {
          result.push(e.payer_wallet_id);
          found = true;
          break;
        }
    console.log("e.payer_wallet_id", e);
    if (!found) result.push(e.payer_wallet_id);
  }
  console.log("result", result);
  return result;
};
module.exports = {
  eligibleWallets,
  savePromotion,
  updatePromotionAdmin,
  getAppliedPromotions,
  getAppliedPromotionsAdmin,
  updatePromotion,
  isEligibleForBlogs,
};