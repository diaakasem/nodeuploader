
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'Upload Files Express Project' });
};
