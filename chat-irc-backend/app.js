const express = require('express');

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));

//Setup Cross Origin
app.use(require("cors")());

//Bring in the routes
app.use("/user", require("../chat-irc-backend/routes/user"));
app.use("/channel", require("../chat-irc-backend/routes/channel"));

//Setup Error Handlers
const errorHandlers = require('../chat-irc-backend/handlers/errorHandlers')
app.use(errorHandlers.notFound);
app.use(errorHandlers.mongooseErrors);
if (process.env.ENV === "DEVELOPMENT"){
    app.use(errorHandlers.developmentErrors);
} else {
    app.use(errorHandlers.productionErrors);
}

module.exports = app;