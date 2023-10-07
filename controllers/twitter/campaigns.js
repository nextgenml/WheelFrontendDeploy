const campaignRepo = require("../../repository/twitter_campaigns");

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

const getCampaignById = async (req, res) => {
  const { campaignId, walletId } = req.query;
  const campaign = await campaignRepo.getCampaignById(campaignId, walletId);
  res.json({
    data: campaign,
  });
};

const updateCampaign = async (req, res) => {
  const { walletId } = req.query;
  const { campaignId } = req.params;

  await campaignRepo.updateCampaign(campaignId, walletId, req.body);
  res.json({
    message: "Updated successfully",
  });
};

const toggleCampaignState = async (req, res) => {
  const { walletId } = req.query;
  const { campaignId } = req.params;

  await campaignRepo.toggleCampaignState(campaignId, walletId, req.body.action);
  res.json({
    message: "Updated successfully",
  });
};
module.exports = {
  saveCampaign,
  getCampaigns,
  getCampaignById,
  updateCampaign,
  toggleCampaignState,
};
