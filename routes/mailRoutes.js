const express = require('express');
const router = express.Router();
const postMailController = require('../controllers/mail/mailController');

router.post(
    "/sendMail",
    postMailController.controllers.postMail
  );
  

module.exports  = router;