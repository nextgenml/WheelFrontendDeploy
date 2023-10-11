const campaignRepo = require("../../repository/twitter_campaigns");
const campaignManager = require("../../manager/twitter/campaigns");

const saveCampaign = async (req, res) => {
  try {
    const { body } = req;
    const { walletId } = req.query;
    await campaignRepo.saveCampaign(walletId, body);
    res.json({
      message: "Campaign created successfully",
    });
  } catch (error) {
    return res.status(400).json({
      statusCode: 400,
      message: error,
    });
  }
};

const getCampaigns = async (req, res) => {
  try {
    const { walletId, search, pageNo, pageSize } = req.query;

    const data = await campaignRepo.getCampaigns(
      walletId,
      search,
      parseInt(pageSize) || 10,
      (parseInt(pageSize) || 10) * (parseInt(pageNo) || 0)
    );
    res.json({
      data: data.campaigns,
      total_count: data.count,
    });
  } catch (error) {
    return res.status(400).json({
      statusCode: 500,
      message: error,
    });
  }
};

const getActiveCampaigns = async (req, res) => {
  try {
    const data = await campaignRepo.getAllActiveCampaigns();
    res.json({
      data,
    });
  } catch (error) {
    return res.status(400).json({
      statusCode: 500,
      message: error,
    });
  }
};

const getCampaignById = async (req, res) => {
  const { id, walletId } = req.query;
  const campaign = await campaignRepo.getCampaignById(id, walletId);
  res.json({
    data: campaign,
  });
};

const updateCampaign = async (req, res) => {
  const { walletId } = req.query;
  const { id } = req.params;

  await campaignRepo.updateCampaign(id, walletId, req.body);
  res.json({
    message: "Updated successfully",
  });
};

const toggleCampaignState = async (req, res) => {
  const { walletId } = req.query;
  const { id } = req.params;

  await campaignRepo.toggleCampaignState(id, walletId, req.body.action);
  res.json({
    message: "Updated successfully",
  });
};
const campaignStats = async (req, res) => {
  const { id } = req.params;

  const results = await campaignManager.getCampaignStats(id);
  res.json({
    data: results,
  });
};

module.exports = {
  saveCampaign,
  getCampaigns,
  getCampaignById,
  updateCampaign,
  toggleCampaignState,
  getActiveCampaigns,
  campaignStats,
};