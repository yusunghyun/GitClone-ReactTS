var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.sendFile(path.join('../dist/test.html'))
});
module.exports = router;