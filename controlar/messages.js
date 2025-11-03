const Controlars = {}
const ChatColl = require("../mongoose/models/chat.js")
const userColl = require("../mongoose/models/User.js")

Controlars.createChat = async (req,resp)=>{
  const { members } = req.body || {}
  if(!members.length){
    resp.status(500).json({ error:"please add members!" })
    return
  }
  
  // Cheak Alrady have or not
  const userAllChats = await ChatColl.find({ members: members[0] }).find({ members: members[1] })
  if(userAllChats.length){
    resp.status(404).json({
      error:"Alrady Have Chat"
    })
    return
  }
  
  // Create new
  try{
    const newChat = new ChatColl({members})
    const chat = await newChat.save()
    resp.status(200).json({ chat_id: chat._id })
  }catch(err){
    resp.status(500).json({
      error:"Server error!"
    })
  }
  
}

// Get all chats
Controlars.getChatList = async (req,resp)=>{
  const { id } = req.params
  
  // Find my chats 
  const chats = await ChatColl.find({members:id})
  const MyChats = []
  // Loop All Open Chats
  for ( const chat of chats ){
    const members = chat.members; // chats members id
    // loop all member id
    for ( const member of members ){
      // Match id => is not userId
      if(String(member) !== id){
        // get this user data
        const chatDtl = await new Promise(async (resolve)=>{
          const anUser = await userColl.findOne({ _id: member })
          const chatData = {
            chat_id: chat._id,
            user_id: member,
            user_avatar: anUser.avatar.url,
            user_name: anUser.name
          }
          resolve(chatData)
        })
        
        MyChats.push(chatDtl)
        
      }
    }
  }
  
  resp.status(200).json({
    chats:MyChats
  })
  
}

module.exports = Controlars