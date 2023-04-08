const { runQueryAsync } = require("../utils/spinwheelUtil");

const getCampaignById = async (id) => {
  const query = `select * from campaigns where id = ?`;

  const results = await runQueryAsync(query, [id]);

  return results[0];
};
const getCampaignForChore = async (choreId) => {
  const query = `select cd.*, c.success_factor, c.reward, c.is_recursive_algo, cc.chore_type from campaign_details cd 
                  inner join campaigns c on c.id = cd.campaign_id 
                  inner join chores cc on cc.campaign_detail_id = cd.id
                  where cc.id = ?`;

  const results = await runQueryAsync(query, [choreId]);

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
  getCampaignForChore,
};
