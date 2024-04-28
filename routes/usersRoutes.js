var express = require('express');
var router = express.Router();
const userModel = require("../models/userModel");

/* GET users listing. */
router.get('/', function (req, res, next) {
    userModel.findAll().then((users) => {
        res.send(users);
    }).catch((error) => {
        res.send(error);
    })
});

module.exports = router;
