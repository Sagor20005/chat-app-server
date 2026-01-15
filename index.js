require('dotenv').config()
const GetMyFrirnds = require("./utilities/GetMyFrirnds.js")
const { express, App, server, io } = require("./server.js")
const cors = require("cors")



const PORT = 7000
const ACTIVE_LIST = {}

// Database
const Connect = require("./mongoose/connect.js")
Connect()

App.use(express.json())
App.use(cors())
App.use(require("./routes/user.js"))
App.use(require("./routes/main.js"))
App.use("/message",require("./routes/messages.js"))


io.on("connection",async (socket)=>{
  
  //check Uid Contain ?
  if(socket.handshake.auth.uid){
    // Save {uid: socket_id}
    ACTIVE_LIST[socket.handshake.auth.uid] = socket.id
    
    // Announce the user is online 
    const uid = socket.handshake.auth.uid
    const UserFriends = await GetMyFrirnds(uid)
    if(!Array.isArray(UserFriends)) return // check data type 
    // send allert for friends 
    UserFriends.forEach((f_uid)=>{
      //check friend is on the active list then send alert
      if(Object.keys(ACTIVE_LIST).includes(f_uid)){
        io.to(ACTIVE_LIST[f_uid]).emit("user_online_event",{
          user_id: uid
        })
      }
    })
  }
  
  socket.on("disconnect", async ()=>{
    // check uid is ok ?
    const uid = socket.handshake.auth.uid
    if (!uid) return
    // check is active
    let IsActive = false
    for (const id in ACTIVE_LIST){
      if(id === uid) IsActive = true
    }
    // delete user from active list
    if (!IsActive) return
    delete ACTIVE_LIST[uid]
    
    // Anounce all connected user of this user 
    const UserFriends = await GetMyFrirnds(uid)
    if(!Array.isArray(UserFriends)) return // check data type 
    // send allert for friends 
    UserFriends.forEach((f_uid)=>{
      //check friend is on the active list then send alert
      if(Object.keys(ACTIVE_LIST).includes(f_uid)){
        io.to(ACTIVE_LIST[f_uid]).emit("user_offline_event",{
          user_id: uid,
          time: Date.now()
        })
      }
    })
  })
  
  socket.on("checkWhosOnline",(data)=>{
    const users = data.users;
    const host = data.host
    if(!Array.isArray(users) || !users.length) return
    const online_users = users.filter(user => Object.keys(ACTIVE_LIST).includes(user))
    if(!Object.keys(ACTIVE_LIST).includes(host)) return
    io.to(ACTIVE_LIST[host]).emit("checkWhosOnline",{online_users})
  })
  
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