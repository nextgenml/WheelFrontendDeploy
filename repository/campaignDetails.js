const { runQueryAsync } = require("../utils/spinwheelUtil");
const moment = require("moment");

const getActiveCampaigns = async () => {
  const query = `select cd.id, cd.media_type from campaign_details cd 
                inner join campaigns c on c.id = cd.campaign_id 
                where cd.start_time <= now() and cd.end_time >= now() 
                and c.start_time <= now() and c.end_time >= now() and c.is_active = 1 and cd.is_active = 1 and cd.content_type = 'text'`;

  return await runQueryAsync(query, []);
};

const getPostedCampaigns = async () => {
  const query = `select cd.* from campaign_details cd 
                inner join campaigns c on c.id = cd.campaign_id 
                where (cd.last_checked_date is null or cd.end_time > cd.last_checked_date) 
                and c.is_active = 1 and cd.is_active = 1 and cd.content_type = 'text'`;

  return await runQueryAsync(query, []);
};

const getCampaignImages = async (collectionId) => {
  const query = `select content from campaign_details where content_type = 'image' and collection_id = ?`;

  return await runQueryAsync(query, [collectionId]);
};

const updateLastCheckedDate = async (id, endTime) => {
  const query = `update campaign_details set last_checked_date = ? where id = ?`;

  return await runQueryAsync(query, [moment(endTime).format(), id]);
};
module.exports = {
  getActiveCampaigns,
  getPostedCampaigns,
  updateLastCheckedDate,
  getCampaignImages,
};
