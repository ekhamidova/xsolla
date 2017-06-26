var express = require('express');
var guid = require('guid');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
 // res.render('index', { title: 'Express' });
  res.redirect('/users');
});

router.get('/users', function(req, res) {
  res.render('index', { title: 'Пользователи' });
});


router.get('/users/:user_id', function(req, res) {
  var user_id = req.params.user_id;
  console.log("user_id "+user_id);
  res.render('user', { title: 'Пользователь '+user_id, user_id:user_id});
});


router.get('/newUser', function(req, res) {
  var Guid = guid.create();
 // console.log(Guid.value) ;
   res.render('newUser', { title: 'Создать нового пользователя', user_id:Guid.value});
});

router.get('/users/:user_id/transactions', function(req, res) {
  var user_id = req.params.user_id;
  res.render('transactions', { title: 'Операции пользователя ', user_id:user_id});
});


module.exports = router;
