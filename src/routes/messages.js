/**
 * Route for retrieving messages
 */
const getMessagesOf = require("../helpers/getMessagesOf");
const express = require("express");
const router = express.Router();

router.get("/messages/:ip", async (req, res) => {
  const messages = await getMessagesOf(req.params.ip);
  res.send({ response: messages }).status(200);
});

module.exports = router;