const router = require("express").Router()
const messageControlars = require("../controlar/messages.js")

router.post("/chat",messageControlars.createChat)
router.get("/chat/:id",messageControlars.getChatList)


module.exports = router