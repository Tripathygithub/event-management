var express = require('express');
var router = express.Router();
const multer = require("multer");
const path = require("path");
var storage = multer.memoryStorage()
var upload = multer({ storage: storage });

const userController=require('../../controllers/auth/user')
router.get('/get-my-profile',userController.myProfile);



module.exports = router;


