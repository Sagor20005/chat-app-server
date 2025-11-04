const { express, App, server, io } = require("./server.js")
require('dotenv').config()
const cors = require("cors")



const PORT = 7000

// Database
const Connect = require("./mongoose/connect.js")
Connect()

App.use(express.json())
App.use(cors())
App.use(require("./routes/user.js"))
App.use(require("./routes/main.js"))
App.use("/message",require("./routes/messages.js"))


io.on("connection",(socket)=>{
  socket.on("user_message",(message)=>{
    io.emit("new_message",message)
  })
})



server.listen(PORT,()=>{
  console.log("Messengar Api running at: ",PORT)
})