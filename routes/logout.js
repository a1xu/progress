/*
 * GET home page.
 */

 var logout = require('../login_data.json');

/*exports.view = function(req, res){
  var name = req.params.name;
  res.render('index');
};
*/

exports.logout = function(req, res) { 
	console.log(req);
	var username = req.query.username;
	var password = req.query.password;
	var newUser = {"username":username, "password": password};
	//data.users.push(newUser);
	console.log(newUser);
    res.redirect('/calendar');
	//res.render('index', loginData);
 };
