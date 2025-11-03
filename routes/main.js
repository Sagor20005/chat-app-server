const Router = require("express").Router()
const Controlar = require("../controlar/main.js")
const multer  = require('multer')
const storage = multer.memoryStorage()
const upload = multer({ storage: storage })

Router.post("/avatar",upload.single("avatar"),Controlar.uploadAvatar)

module.exports = Router