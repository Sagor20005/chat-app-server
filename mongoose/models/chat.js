const mongoose = require("mongoose")
const { Schema } = mongoose


const chatSchema = new Schema({
  members: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  messages: [String]
})


module.exports = mongoose.model("chat",chatSchema)