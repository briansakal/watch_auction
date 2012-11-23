var passport = require('passport')
	, LocalStrategy = require('passport-local').Strategy
	, db = require('mongoskin').db('localhost:27017/auction_site', {safe:true})
	, users = db.collection('users')
	//, iform = require('iform')
	;
/*
var userForm = iform({
	  username:{ required: true, }
	, password:{ required:true, }
	, email: 'email'
});
*/
passport.serializeUser(function(user, done) {
	done(null, user._id);
	});

passport.deserializeUser(function(id, done) {
	users.findById(id, function (err,user){
		if(err){ done(new Error('User ' + id + ' does not exist'), user); }
		else{ done(null,user); }
		});
	});

// Use the LocalStrategy within Passport.
//   Strategies in passport require a `verify` function, which accept
//   credentials (in this case, a username and password), and invoke a callback
//   with a user object.  In the real world, this would query a database;
//   however, in this example we are using a baked-in set of users.
passport.use(new LocalStrategy(function(username, password, done) {
		// asynchronous verification, for effect...
		process.nextTick(function () {
			// Find the user by username.  If there is no user with the given
			// username, or the password is not correct, set the user to `false` to
			// indicate failure and set a flash message.  Otherwise, return the
			// authenticated `user`.
			users.findOne({'username':username}, function(err, user) {
				if (err) { return done(err); }
				if (!user) { return done(null, false, { message: 'Unknown user ' + username }); }
				if (user.password != password) { return done(null, false, { message: 'Invalid password' }); }
				return done(null, user);
				});
			});
		}
	));


// Simple route middleware to ensure user is authenticated.
//   Use this route middleware on any resource that needs to be protected.  If
//   the request is authenticated (typically via a persistent login session),
//   the request will proceed.  Otherwise, the user will be redirected to the
//   login page.
exports.ensureAuthenticated = function (req, res, next) {
	if (req.isAuthenticated()) { return next(); }
	res.redirect('/login')
	}

exports.passport = passport;

///////////////////////////////
////	Routes
///////////////////////////////
exports.list = function(req, res){
	users.find().toArray(function(err, docs){
		res.send(docs);
		});
};

exports.detail_user = function(req, res){
	users.findOne({username:req.params.username}, function(err,user){
		res.send(user)
		});
};

exports.update_user = function(req, res){
	if(req.method == 'GET'){
		users.findOne({username:req.params.username}, function(err, user){
			if(!user){ res.send("No such user."); }
			else{ delete user[password]; }
			res.render('user.update',{'title':'Edit User '+user.username, 'user':user});
		});
	}
	else if(req.method == 'POST'){
		users.update({username:req.params.username}, req.params /*TODO: include only params that are user fields*/, function(err){
			if(err){ throw err; }
			res.redirect('/');
		});
	}
};


exports.create_user = function(req, res){
	if(req.method == 'GET'){
		var user = { username:'', password:'', email:'' };
		res.render('user/create',{'title':'Create User', 'user':user, });
	}
	else if(req.method == 'POST'){
		var user = { username:req.body.username, password:req.body.password, email:req.body.email };
		users.insert(user, function(err, result){
			res.redirect('/');
		});
	}
};

exports.delete_user = function(req, res){
	db.collection(req.params.collection).remove({_id: db.ObjectID.createFromHexString(req.params.id)}, function(err, result){
		res.redirect('/'); // TODO: redirect to referrer page
	});
}

exports.login = function(req, res){
	if(req.method == 'GET'){ 
		res.render('login',{'title':'Login'});
		//res.send({'title':'Login Form','username':'put username here'}); 
		}
	else{ 
		res.redirect('/'); 
		}
};

exports.logout = function(req, res){
	req.logout();
	res.redirect('/');
	};