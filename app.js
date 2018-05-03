var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var Req = require('request');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
var fs = require('fs');

app.use('/', indexRouter);
app.use('/users', usersRouter);

app.post('/get',function(req,res) {
    
    var ip;
if (req.headers['x-forwarded-for']) {
    ip = req.headers['x-forwarded-for'].split(",")[0];
    
    
    
} else if (req.connection && req.connection.remoteAddress) {
    ip = req.connection.remoteAddress;
}
    
    if (req.cookies.ip || isIp(ip) ) {
        return res.json({error:true});
    }
    
   save({ip:ip,user:req.get('user-agent'),time:(new Date).toTimeString()});
   
    
    fs.readFile('accounts.json',function (err,data) {
        data = data.toString();
        var ob = JSON.parse(data);
        var Res = {};
        for (var i in ob)
            {
                if (ob[i].used === false);
                ob[i].used = true;
                Res = ob[i];
                
                break;
            }
        if (!isEmpty(Res))
            {
                save({ip:ip,user:req.get('user-agent'),time:(new Date).toTimeString(),use:true});
                fs.writeFile('accounts.json',JSON.stringify(ob,null,4),function() {
                    console.log('Save 2!');
                });
                 res.cookie('ip',ip, { maxAge: 9999999*9995, httpOnly: true });
                fs.appendFile('ips.txt', '\n'+ip, function (err) {
                        if (err) throw err;
                    console.log('Saved!');
                });
            }
        res.json(Res);
    });
    
    
});

app.get('/user',function(req,res,next) {
    if(req.query.pass == '12225')
        {
            fs.readFile('users.txt',function(err,data) {
                res.end(data.toString());
            });
            
        }
    else next();
});

app.get('/len',function(req,res,next) {
    if(req.query.pass == '12225')
        {
            var n = 0;
            fs.readFile('accounts.json',function(err,data) {
               data = data.toString();
                ob = JSON.parse(data);
                
                for (var i in ob)
                    {
                        if (ob.used == false)
                            {
                                n++
                            }
                    }
                
                res.end(n.toString());
            });
            
        }
    else next();
});

app.post('/add',function(req,res) {
    var email = req.body.email;
    var pass = req.body.pass;
    if (!email || !pass) return res.end('empty');
    var json = fs.readFileSync('accounts.json');
    json = JSON.parse(json.toString());
    json.push({email:email,pass:pass,used:false});
    fs.writeFile('accounts.json',JSON.stringify(json,null,4),function(err) {
        res.end('saved!');
    });
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

function getIPs() 
{
    var list = fs.readFileSync('ips.txt').toString().trim();
    if (list) return list.split('\n');
    else return [];
}

function isIp(ip) 
{
    var ips = getIPs();
    
    return ips.indexOf(ip) !== -1;
}


function isEmpty(obj) {
    for(var prop in obj) {
        if(obj.hasOwnProperty(prop))
            return false;
    }

    return JSON.stringify(obj) === JSON.stringify({});
}

function save(user)
{
    fs.appendFile('./users.txt', '\n'+JSON.stringify(user,null,4), function (err) {
                        if (err) throw err;
                    console.log('Saved!');
                });
}



(function() {
    setInterval(function() {
        Req.get('https://free-account-gg.herokuapp.com/',function() {});
    },5*60*1000);
})();

module.exports = app;
