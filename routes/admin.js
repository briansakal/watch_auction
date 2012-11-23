var db = require('mongoskin').db('localhost:27017/auction_site', {safe:true});

exports.list = function(req, res){
	db.collection(req.params.collection).find().toArray(function(err, docs){
		if(err) res.send("No such collection");
		res.render('admin/list', {'title':req.params.collection+' Collection', 'collection':req.params.collection,'docs':docs});
	});
}

exports.create = function(req, res){
	if(req.method == 'GET'){
		res.render('admin/create_update',{'title':'Create Document', 'collection':req.params.collection, doc_string:""});
	}
	else if(req.method == 'POST'){
		db.collection(req.params.collection).insert(JSON.parse(req.body.doc_string), function(err, doc){
			res.redirect('/admin/'+req.params.collection);
		});
	}
}

exports.update = function(req, res){
	if(req.method == 'GET'){
		db.collection(req.params.collection).findOne({_id: db.ObjectID.createFromHexString(req.params.id)}, function(err, doc){
			if(err) res.send("No such ID in "+req.params.collection+".");
			var doc_without_id = doc;
			delete doc_without_id['_id'];
			res.render('admin/create_update',{'title':'Update Document', 'collection':req.params.collection, doc_string:JSON.stringify(doc_without_id)});
		});
	}
	else if(req.method == 'POST'){
		db.collection(req.params.collection).update({_id: db.ObjectID.createFromHexString(req.params.id)}, JSON.parse(req.body.doc_string), function(err){
			res.redirect('/admin/'+req.params.collection);
		});
	}
}

exports.remove = function(req, res){
	db.collection(req.params.collection).remove({_id: db.ObjectID.createFromHexString(req.params.id)}, function(err, result){
		res.redirect('/admin/'+req.params.collection);
	});
}