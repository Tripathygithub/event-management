var express = require('express');
var router = express.Router();

var adminsRouter=require('./admin')
var usersRouter=require('./user')

const multer=require("multer");
var storage = multer.memoryStorage()
const upload = multer({ storage: storage })

const middleware = require('../../service/middleware').middleware;

const userController=require('../../controllers/auth/user')
router.post('/user/register',userController.register);
router.post('/user/login',userController.login);



router.use(middleware); 

router.use('/admin',adminsRouter)
router.use('/user',usersRouter)
module.exports = router;