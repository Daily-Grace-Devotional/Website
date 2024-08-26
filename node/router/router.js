const express = require('express');
const router = express.Router();
const controller = require('../controller/controller');

router.post('/sendAudio', controller.sendAudio);
router.post('/sendThumbnail', controller.sendThumbnail);

module.exports = router;