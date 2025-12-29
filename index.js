require('dotenv').config()
const { express, App, server, io } = require("./server.js")
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
  
  socket.on("seen",(data)=>{
    io.emit("seen_response",data)
  })
  
  socket.on("typing",(data)=>{
    io.emit("typing_res",data)
  })
  
  socket.on("react",(data)=>{
    io.emit("react_res",data)
  })
  
  socket.on("undo_react",(data)=>{
    io.emit("undo_react",data)
  })
  
})



server.listen(PORT,()=>{
  console.log("Messengar Api running at: ",PORT)
})