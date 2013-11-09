
/*
 * GET users listing.
 */

exports.show = function(req, res){
  res.send(req.params.handle);
};