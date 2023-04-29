const router = require("express").Router();
const chatgptController = require("../controllers/chatgpt");
const { validateLoginSession } = require("./auth");

router.post("/", chatgptController.chatGptResponse);
module.exports = router;
