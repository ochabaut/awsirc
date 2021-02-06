const mongoose = require ('mongoose');

const messageSchema = new mongoose.Schema({
    channel: {
        type: mongoose.Schema.Types.ObjectId,
        required: 'Channel is required!',
        ref: "Channel"
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: 'User is required!',
        ref: "User",
    },
    message: {
        type: String,
        required: 'message is required'
    },
});

module.exports = mongoose.model("Message", messageSchema);