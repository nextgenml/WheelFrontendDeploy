const { runQueryAsync } = require("../utils/spinwheelUtil");
const moment = require("moment");
const config = require("../config");

const getActiveCampaigns = async () => {
  const query = `select cd.id, cd.media_type from campaign_details cd 
                inner join campaigns c on c.id = cd.campaign_id 
                where cd.start_time <= now() and cd.end_time >= now() 
                and c.start_time <= now() and c.end_time >= now() and c.is_active = 1 and and c.is_default = 0
                and cd.is_active = 1 and cd.content_type = 'text'`;

  return await runQueryAsync(query, []);
};
const getDefaultCampaign = async () => {
  const query = `select cd.id, cd.media_type from campaign_details cd 
                inner join campaigns c on c.id = cd.campaign_id 
                where cd.start_time <= now() and cd.end_time >= now() 
                and c.start_time <= now() and c.end_time >= now() and c.is_active = 1 and c.is_default = 1
                and cd.is_active = 1 and cd.content_type = 'text'`;

  const results = await runQueryAsync(query, []);
  return results[0];
};

const getPostedCampaigns = async () => {
  const query = `select cd.* from campaign_details cd 
                inner join campaigns c on c.id = cd.campaign_id 
                where (cd.last_checked_date is null or cd.end_time > cd.last_checked_date) 
                and c.is_active = 1 and cd.is_active = 1 and cd.content_type = 'text'`;

  return await runQueryAsync(query, []);
};

const updateLastCheckedDate = async (id, endTime) => {
  const query = `update campaign_details set last_checked_date = ? where id = ?`;

  return await runQueryAsync(query, [moment(endTime).format(), id]);
};

const saveCampaign = async (data) => {
  const query = `insert into campaigns (client, campaign, start_time, end_time, minimum_check, success_factor, is_active, wallet_id, is_default) values(?, ?, ?, ?, ?, ? ,?, ?, ?);`;

  return await runQueryAsync(query, [
    data.client,
    data.campaign_name,
    moment(data.start_time).startOf("day").format(),
    moment(data.end_time).endOf("day").format(),
    1,
    data.success_factor,
    1,
    data.wallet_id,
    data.default ? 1 : 0,
  ]);
};

const saveCampaignDetails = async (data) => {
  const query = `insert into campaign_details (campaign_id, content, content_type, start_time, end_time, collection_id, media_type, is_active) values(?, ?, ?, ?, ?, ? ,?, ?);`;

  return await runQueryAsync(query, [
    data.campaign_id,
    data.content || "",
    data.content_type,
    moment(data.start_time).startOf("day").format(),
    moment(data.end_time).endOf("day").format(),
    data.collection_id,
    data.media_type,
    1,
  ]);
};

const canCreateChore = async (id, choreType) => {
  const query = `select success_factor from campaigns c inner join campaign_details cd on cd.campaign_id = c.id where cd.id = ?`;

  const campaigns = await runQueryAsync(query, [id]);
  const successFactor = campaigns[0] ? campaigns[0].success_factor : "best";
  let allowedChores =
    config.SUCCESS_FACTOR[successFactor.toUpperCase()][choreType.toUpperCase()];
  allowedChores +=
    (allowedChores * config.SUCCESS_FACTOR_UPPER_BOUND_PERCENTAGE) / 100;
  const query2 = await runQueryAsync(
    `select count(id) as count from campaign_details where is_completed = 1 and choreType = ? and campaign_detail_id = ?`,
    [choreType, id]
  );
  const completedChores = query2[0] ? query2[0].count : 0;

  return allowedChores >= completedChores;
};

module.exports = {
  getActiveCampaigns,
  getPostedCampaigns,
  updateLastCheckedDate,
  saveCampaign,
  saveCampaignDetails,
  canCreateChore,
  getDefaultCampaign,
};
