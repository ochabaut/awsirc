require("dotenv").config();

const mongoose = require('mongoose');
mongoose.connect(process.env.DATABASE, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
});

mongoose.connection.on("error", (err) =>{
    console.log("Mongoose Connection ERROR: " + err.message);
});

mongoose.connection.once('open', ()=>{
    console.log("MongoDB Connected!");
});

//Bring in the models
require('../chat-irc-backend/models/User');
require('../chat-irc-backend/models/Channel');
require('../chat-irc-backend/models/Message');

const app = require('./app');

const server = app.listen(8000, () =>{
    console.log('Server listening on port 8000');
});

const io = require('socket.io')(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST", "DELETE"],
        headers: ["Content-Type", "Authorization", "Content-Length", "X-Requested-With", "*"],
    }
});
const jwt = require('jwt-then');

const Message = mongoose.model("Message");
const User = mongoose.model("User");

io.use(async (socket, next) => {
    try{
        const token = socket.handshake.query.token;
        const payload = await jwt.verify(token, process.env.SECRET);
        socket.userId = payload.id;
        next();
    } catch (err) {}
});

io.on('connection', (socket) => {
    console.log("connected: " + socket.userId);

    socket.on("disconnect", () => {
        console.log("Disconnected:" + socket.userId);
    });

    socket.on("joinRoom", ({ channelId }) => {
        socket.join(channelId);
        console.log(channelId);
        console.log("A user joined channel:" + channelId);
    });

    socket.on("leaveRoom", ({ channelId }) => {
        socket.leave(channelId);
        console.log("A user left channel:" + channelId);
    });

    socket.on("channelMessage", async ({channelId, message}) => {
        if(message.trim().length > 0){
            const user = await User.findOne({_id: socket.userId });
            const newMessage = new Message({
                channel: channelId, 
                user: socket.userId, 
                message, 
            })
            
            io.to(channelId).emit("newMessage", {
                message,
                name: user.name,
                userId: socket.userId
            });

            await newMessage.save();
        }
    });
});