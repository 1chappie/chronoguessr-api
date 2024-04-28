var express = require('express');
var router = express.Router();
const dataController = require('../controllers/dataController');
const {isAuthorized,isAuthenticated,isNotAuthenticated} = require("../middleware/authCheck");

router.get('/', isAuthenticated, function(req, res, next) {
    res.send(dataController());
});

module.exports = router;
