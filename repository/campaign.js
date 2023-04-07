const { runQueryAsync } = require("../utils/spinwheelUtil");

const getCampaignById = async (id) => {
  const query = `select * from campaigns where id = ?`;

  const results = await runQueryAsync(query, [id]);

  return results[0];
};
const getCampaignByDetailsId = async (detailsId) => {
  const query = `select c.* from campaigns c inner join campaign_details cd on cd.campaign_id = c.id where cd.id = ?`;

  const results = await runQueryAsync(query, [detailsId]);

  return results[0];
};

module.exports = {
  getCampaignById,
  getCampaignByDetailsId,
};
