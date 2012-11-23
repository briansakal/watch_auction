var db = require('mongoskin').db('localhost:27017/auction_site', {safe:true})
	, auctions = db.collection('auctions');

exports.list = function(req, res){
	auction_list = auctions.find().toArray(function(err, result){
		if(err) throw err;
		res.send(result);
		});
}
exports.detail = function(req, res){}
exports.create = function(req, res){
	auction_list = db.insert({title:'Super Watch', current_price:'53.62'});
}