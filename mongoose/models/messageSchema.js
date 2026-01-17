const mongoose = require("mongoose")
const { Schema } = mongoose


const MessageSchemaema = new Schema({
    message_data: {
        type: Object
    },
    message_id: String
})


module.exports = mongoose.model("message", MessageSchemaema)