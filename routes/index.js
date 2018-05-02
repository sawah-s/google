var express = require('express');
var router = express.Router();
var fs = require('fs');

/* GET home page. */
router.get('/', function(req, res, next) {
    save({user:req.get('user-agent'),time:(new Date).toTimeString(),type:'gg'});
  res.render('index', { title: 'Express' });
});

function save(user)
{
    fs.appendFile('./users.txt', '\n'+JSON.stringify(user,null,4), function (err) {
                        if (err) throw err;
                    console.log('Saved!');
                });
}


module.exports = router;
