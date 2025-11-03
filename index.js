const express = require("express")
const cors = require("cors")
const App = express()
require('dotenv').config()

const PORT = 7000

// Database
const Connect = require("./mongoose/connect.js")
Connect()

App.use(express.json())
App.use(cors())
App.use(require("./routes/user.js"))
App.use(require("./routes/main.js"))
App.use("/message",require("./routes/messages.js"))


App.listen(PORT,()=>{
  console.log("Messengar Api running at: ",PORT)
})