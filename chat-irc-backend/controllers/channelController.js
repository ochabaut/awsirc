const mongoose = require('mongoose');
const Channel = mongoose.model('Channel');
const Message = mongoose.model('Message');

exports.createChannel = async (req, res) => {
    const {name} = req.body;
    const nameRegex = /^[A-Za-z0-9\s]+$/;

    if(!nameRegex.test(name)) throw "Channel name can contain only alphabets.";

    const channelExists = await Channel.findOne({ name: name });

    if (channelExists) throw "Channel with that name already exists!";

    const channel = await new Channel({
        name,
    });

    await channel.save();

    res.json({
        message: "Channel created!",
    });
};

exports.getAllChannels = async (req, res, next) => {
    const channels = await Channel.find({});
  
    res.json(channels);
};

exports.deleteChannel = async (req, res, next) => {

    const params = req.params;
  
    try {
  
      const channel = await Channel.findOne({ _id: params.id });
   
      if (!channel) {
        res.json({
          message: "Channel does not exist !",
        })
        return;
      }
      channel.deleteOne();
  
      res.json({ deleted: true });
  
    } catch (e) {
      res.json({ error: e });
    }
};