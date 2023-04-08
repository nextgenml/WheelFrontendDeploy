const router = require("express").Router();
const paymentsController = require("../controllers/payments");
const { validateWalletId } = require("./auth");

router.get("/", validateWalletId, paymentsController.getPayments);
router.get("/stats", validateWalletId, paymentsController.paymentStats);
module.exports = router;
