const router = require('express').Router();
const {catchErrors} = require('../../chat-irc-backend/handlers/errorHandlers');
const channelController = require('../controllers/channelController');

const auth = require('../middleware/auth');

router.get("/", auth, catchErrors(channelController.getAllChannels));
router.post("/", auth, catchErrors(channelController.createChannel));
router.delete('/:id', channelController.deleteChannel);


module.exports = router;