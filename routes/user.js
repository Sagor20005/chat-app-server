const express = require("express")
const router = express.Router()
const userControlar = require("../controlar/user.js")

router.post("/signup",userControlar.Signup)
router.post("/signin",userControlar.Login)
router.get("/login-token/:id", userControlar.ResetToken)
router.get("/users",userControlar.userList)

module.exports = router