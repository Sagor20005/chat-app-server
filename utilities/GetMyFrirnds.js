const ChatColl = require("../mongoose/models/chat.js")

async function GetMyFriends(uid){
  const id = uid
  if(!id || typeof(id) !== "string") return []
  
  // Find my chats 
  const chats = await ChatColl.find({members:id})
  const AllConnectedIds = []
  // Loop All Open Chats
  for ( const chat of chats ){
    const members = chat.members; // chats members id
    // loop all member id
    for ( const member of members ){
      // Match id => is not userId
      if(String(member) !== id){
        AllConnectedIds.push(String(member))
      }
    }
  }
  return AllConnectedIds
}

module.exports = GetMyFriends