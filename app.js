
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  //, passport = require('passport')
  , http = require('http')
  , path = require('path')
  , auction = require('./routes/auction')
  , admin = require('./routes/admin');

var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser()); 
  app.use(express.session({ secret: 'keyboard cat' }));
  app.use(user.passport.initialize());
  app.use(user.passport.session());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/', routes.index);
app.get('/login', user.login);
app.post('/login/:successRedirect', user.passport.authenticate('local', { failureRedirect: '/login', failureFlash: true }), user.login);
app.get('/users', user.list);
app.get('/users/create', user.create_user);
app.post('/users/create', user.create_user);
app.get('/users/:username', user.detail_user);
app.get('/users/:username/update', user.update_user);
app.post('/users/:username/update', user.update_user);
app.get('/auctions', user.ensureAuthenticated, auction.list);
app.get('/auctions/:auction_id', auction.detail);
app.get('/auctions/:auction_id/edit', auction.detail);
app.post('/auctions/:auction_id/edit', auction.detail);
app.get('/delete/:collection/:id', user.delete_user);

app.get('/admin/:collection', admin.list);
app.get('/admin/:collection/create', admin.create);
app.post('/admin/:collection/create', admin.create);
app.get('/admin/:collection/:id', admin.update);
app.post('/admin/:collection/:id', admin.update);
app.get('/admin/:collection/:id/delete', admin.remove);


http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
