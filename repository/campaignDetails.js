const { runQueryAsync } = require("../utils/spinwheelUtil");
const moment = require("moment");
const config = require("../config");

const getActiveCampaigns = async () => {
  const query = `select cd.id, cd.media_type from campaign_details cd 
                inner join campaigns c on c.id = cd.campaign_id 
                where cd.start_time <= now() and cd.end_time >= now() 
                and c.start_time <= now() and c.end_time >= now() and c.is_active = 1 and c.is_default = 0
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
  const query = `insert into campaigns (client, campaign, start_time, end_time, minimum_check, success_factor, is_active, wallet_id, is_default, reward) values(?, ?, ?, ?, ?, ? ,?, ?, ?, ?);`;

  return await runQueryAsync(query, [
    data.client,
    data.campaign_name,
    moment(data.start_time).startOf("day").format(),
    moment(data.end_time).endOf("day").format(),
    1,
    data.success_factor,
    1,
    data.wallet_id,
    data.default === "true" ? 1 : 0,
    config.COST_PER_CHORE,
  ]);
};

const updateCampaign = async (campaignId, isActive) => {
  // const query = `update campaigns set client = ?, campaign = ?, start_time = ?, end_time = ?, success_factor = ?, is_default = ? where id = ?`;

  // return await runQueryAsync(query, [
  //   data.client,
  //   data.campaign_name,
  //   moment(data.start_time).startOf("day").format(),
  //   moment(data.end_time).endOf("day").format(),
  //   data.success_factor,
  //   data.default ? 1 : 0,
  // ]);
  const query = `update campaigns set is_active = ? where id = ?`;

  await runQueryAsync(query, [isActive, campaignId]);

  const query2 = `update campaign_details set is_active = ? where campaign_id = ?`;
  await runQueryAsync(query2, [isActive, campaignId]);
};

const saveCampaignDetails = async (data) => {
  const query = `insert into campaign_details (campaign_id, content, content_type, start_time, end_time, collection_id, media_type, is_active, image_urls) values(?, ?, ?, ?, ?, ? ,?, ?, ?);`;

  return await runQueryAsync(query, [
    data.campaign_id,
    data.content || "",
    data.content_type,
    moment(data.start_time).startOf("day").format(),
    moment(data.end_time).endOf("day").format(),
    data.collection_id,
    data.media_type,
    1,
    data.image_urls,
  ]);
};

const canCreateChore = async (id, choreType) => {
  const query = `select success_factor from campaigns c inner join campaign_details cd on cd.campaign_id = c.id where cd.id = ?`;

  const campaigns = await runQueryAsync(query, [id]);
  const successFactor = campaigns[0] ? campaigns[0].success_factor : "best";
  let allowedChores =
    config.SUCCESS_FACTOR[successFactor.toUpperCase()][choreType.toUpperCase()];
  console.log("allowedChores", allowedChores, successFactor, choreType);
  allowedChores +=
    (allowedChores * config.SUCCESS_FACTOR_UPPER_BOUND_PERCENTAGE) / 100;
  const query2 = await runQueryAsync(
    `select count(id) as count from chores where is_completed = 1 and chore_type = ? and campaign_detail_id = ?`,
    [choreType, id]
  );
  const completedChores = query2[0] ? query2[0].count : 0;

  console.log(
    "allowedChores",
    allowedChores,
    "completedChores",
    completedChores
  );
  return allowedChores >= completedChores;
};

const getCampaigns = async (walletId) => {
  const query = `select * from campaigns where wallet_id = ? order by id desc`;

  return await runQueryAsync(query, [walletId]);
};
const getCampaignById = async (campaignId) => {
  const query = `select * from campaigns where id = ?`;

  const results = await runQueryAsync(query, [campaignId]);
  const campaign = results[0];

  const query2 = `select * from campaigns  where campaign_id = ?`;

  const details = await runQueryAsync(query2, [campaignId]);

  return {
    ...campaign,
    media: details.map((d) => d.media_type),
    image_urls: details[0].image_urls,
  };
};
module.exports = {
  getActiveCampaigns,
  getPostedCampaigns,
  updateLastCheckedDate,
  saveCampaign,
  saveCampaignDetails,
  canCreateChore,
  getDefaultCampaign,
  getCampaigns,
  getCampaignById,
  updateCampaign,
};
