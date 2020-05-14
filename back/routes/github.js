var express = require('express');
var router = express.Router();
var qs = require('querystring');
var rs = require('randomstring');
const axios = require('axios');

let state;
/* GET home page. */
router.get('/', function(req, res, next) {
  state = rs.generate();
  const url = 'https://github.com/login/oauth/authorize?';
  const query = qs.stringify({
      client_id: '6f8645420453bf128aaa',
      redirect_uri: 'http://localhost:3000/githublogin',
      state: state,
      // scope: 'user:email',
  });
  const githubAuthUrl = url + query;
  res.send(githubAuthUrl)
});

router.get('/login', function(req, res, next) {
  const returncode = req.query.code;
  const returnstate = req.query.state;

  if(state !== returnstate) {
      res.send(false);
  }

  const host = 'https://github.com/login/oauth/access_token?'
  const queryString = qs.stringify({
      client_id: '6f8645420453bf128aaa',
      client_secret: 'f73a448769934f6b56e8f8dcd593e10d0cc1107b',
      code: returncode,
      redirect_uri: "http://localhost:3000/" + 'githublogin',
      state: state,
  })
  const authurl = host + queryString;

  axios.post(authurl)
  .then(function(resp) {
      const token = qs.parse(resp.data).access_token;
      res.send(token)
  })
  .catch(function(err) {
      console.log(err);
  })
});
router.get('/user', function(req, res, next) {
  const config = {
      headers: {
          Authorization: 'token ' + req.query.token,
          'User-Agent': 'Login-App'
      }
  }
  axios.get('https://api.github.com/user/repos', config)
  .then(function(resp) {
      res.send(resp.data[0].email);
  })
  .catch(function(err) {
      console.log(err)
  })
});

module.exports = router;
