const { runQueryAsync } = require("../utils/spinwheelUtil");

const savePromotion = async (data) => {
  const query = `insert into promotion_requests (receiver_wallet_id, payer_wallet_id, overall_promotions_limit, blogs_limit, eth_amount, mark_as_done_by_user, mark_as_done_by_admin, status) values(?, ?, ?, ?, ?, ?, ?, ?);`;

  return await runQueryAsync(query, [
    data.receiver_wallet_id,
    data.payer_wallet_id,
    data.overall_promotions_limit,
    data.blogs_limit,
    data.eth_amount,
    0,
    0,
    "requested",
  ]);
};

const updatePromotion = async (data) => {
  const query = `update promotion_requests set status = ?, mark_as_done_by_admin = ?, reason = ? where id = ?;`;

  return await runQueryAsync(query, [
    data.status,
    data.status === "accepted" ? 1 : 0,
    data.reason,
    data.requestId,
  ]);
};
const getAppliedPromotions = async (walletId, pageSize, offset) => {
  const query = `select * from promotion_requests where payer_wallet_id = ? order by id desc limit ? offset ?;`;

  return await runQueryAsync(query, [walletId, pageSize, offset]);
};

const getAppliedPromotionsAdmin = async (pageSize, offset) => {
  const query = `select * from promotion_requests where status = 'requested' order by id desc limit ? offset ?;`;

  const data = await runQueryAsync(query, [pageSize, offset]);

  const query1 = `select count(1) as count from promotion_requests where status = 'requested'`;
  const count = await runQueryAsync(query1);

  return [data, count[0].count];
};

module.exports = {
  savePromotion,
  updatePromotion,
  getAppliedPromotions,
  getAppliedPromotionsAdmin,
};
