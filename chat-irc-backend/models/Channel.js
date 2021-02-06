const mongoose = require ('mongoose');

const channelSchema = new mongoose.Schema({
    name: {
        type: String,
        required: 'Name is required!'
    },
});

module.exports = mongoose.model("Channel", channelSchema);