const express = require("express")
const router = express.Router()
const userControlar = require("../controlar/user.js")

router.post("/signup",userControlar.Signup)
router.post("/signin",userControlar.Login)
router.get("/login-token/:id", userControlar.ResetToken)
router.get("/users",userControlar.userList)
router.put("/users/nemeusername",userControlar.changeNameAndUsername)
router.put("/users/password",userControlar.changePassword)
router.put("/users/email-phone",userControlar.ChangeEmailPhone)

module.exports = router