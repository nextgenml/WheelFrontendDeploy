const { runQueryAsync } = require("../utils/spinwheelUtil");

const getActiveCampaigns = async () => {
  const query = `select distinct cd.collection_id, cd.id, cd.media_type from campaign_details cd 
                inner join campaigns c on c.id = cd.campaign_id 
                where cd.start_time <= now() and cd.end_time >= now() 
                and c.start_time <= now() and c.end_time >= now()`;

  return await runQueryAsync(query, []);
};

module.exports = {
  getActiveCampaigns,
};
