const messageColl = require("../mongoose/models/messageSchema")
const chatColl = require("../mongoose/models/chat")

async function saveMessage(message) {
    return new Promise(async (resolve) => {
        try {
            message.type = "online"
            const newMessage = new messageColl({ message_data: message, message_id: message.message_id })
            const { _id } = await newMessage.save()
            const chat = await chatColl.findOne({ _id: message.chat_id })
            chat.messages.push(message.message_id)
            await chat.save()
            resolve(true)
        } catch (err) {
            console.log(err)
            resolve(false)
        }
    })
}

module.exports = saveMessage