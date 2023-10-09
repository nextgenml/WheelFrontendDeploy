const router = require("express").Router();
const controller = require("../../controllers/twitter/campaigns");
const choresController = require("../../controllers/twitter/chores");

router.post("/", controller.saveCampaign);
router.put("/:id", controller.updateCampaign);
router.get("/", controller.getCampaigns);
router.get("/active", controller.getActiveCampaigns);
router.get("/:id", controller.getCampaignById);
router.delete("/:id", controller.toggleCampaignState);
router.get("/:id/stats", choresController.campaignStats);

router.post("/:id/computeChores", choresController.computeChores);
router.get("/:id/levels/:levelId", choresController.getChores);
module.exports = router;
