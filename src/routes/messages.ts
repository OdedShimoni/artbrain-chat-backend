/**
 * Route for retrieving messages
 */
const MessagesAPI = require("../MessagesAPI");
const express = require("express");
const router = express.Router();

router.get("/messages/:ip", async (req: any, res: any) => {
  const messagesClient = new MessagesAPI;
  const messages = await messagesClient.getAllOf(req.params.ip);
  res.send({ response: messages }).status(200);
});

export default router;