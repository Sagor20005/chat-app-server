const router = require("express").Router()
const Controlar = require("../controlar/main.js")
const messageControlars = require("../controlar/messages.js")

router.post("/chat", messageControlars.createChat)
router.get("/chat/:id", messageControlars.getChatList)
router.post("/get-message", messageControlars.getMessages)
router.delete("/message", messageControlars.deleteMessage)


module.exports = router