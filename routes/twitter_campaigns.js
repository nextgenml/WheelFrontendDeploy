const router = require("express").Router();
const controller = require("../controllers/twitter/campaigns");

router.post("/", controller.saveCampaign);
router.put("/:id", controller.updateCampaign);
router.get("/", controller.getCampaigns);
router.get("/:id", controller.getCampaignById);
router.delete("/:id", controller.toggleCampaignState);
module.exports = router;
