var http = require('http');
var request = require('request');
var fs = require('fs');


var article_1 = {
	url : "http://www.bbc.co.uk/news/science-environment-18716300",
	title :  "1South Korea unveils 'scientific' whaling proposal",
	author: "Richard Black",
	published_date : "4 July 2012",
	host : "http://www.bbc.co.uk",
	path : "/news/science-environment-18716300.html",
}

var article_2 = {
	url : "http://blog.spoongraphics.co.uk/tutorials/how-to-create-an-abstract-geometric-mosaic-text-effect",
	title :  "How To Create an Abstract Geometric Mosaic Text Effect",
	author: "Chris Spooner",
	published_date : "4 July 2012",
	host : "http://blog.spoongraphics.co.uk",
	path : "/news/how-to-create-an-abstract-geometric-mosaic-text-effect.html",
	
}

var article_3 = {
	url : "http://www.bbc.co.uk/news/science-environment-18716300",
	title :  "3South Korea unveils 'scientific' whaling proposal",
	author: "Richard Black",
	published_date : "4 July 2012",
	host : "http://www.bbc.co.uk",
	path : "/news/science-environment-18716300.html",
}


var article_4 = {
	url : "http://www.bbc.co.uk/news/science-environment-18716300",
	title :  "4South Korea unveils 'scientific' whaling proposal",
	author: "Richard Black",
	published_date : "4 July 2012",
	host : "http://www.bbc.co.uk",
	path : "/news/science-environment-18716300.html",
}

var article_5 = {
	url : "http://www.forbes.com/sites/victorlipman/2012/06/28/how-to-interview-effectively",
	title :  "How To Interview Effectively",
	author: "Victor Lipman",
	published_date : "28 June 2012",
	host : "http://www.forbes.com",
	path : "/news/how-to-interview-effectively.html",
}

var userobject = {
	name : "Catherine Tan",
	id : 301078676,
	courses : {
		"CMPT120" : [article_1, article_2],
		"BUS100" : [article_4],
		"IAT200" : [article_3, article_5]
		}
	}

function mediaPath(path, host){
	if (path.charAt(0)== "/"){
		return "http://" + host + path
	}
	else return path
}


exports.index = function(req, res){
	var courses = []
	 for ( i in (userobject.courses)){
	 	 courses.push(i)
	 	for ( j in (userobject.courses[i])){
	 	//console.log(userobject.courses[i][j].path);
	 };
};

	res.render("index", { 	title: "SFU ENGAGE",
							user :  userobject, 
							courses : courses, 
							status : "logged in" })

	
}


exports.simplify = function(req, res){
	console.log(req.body.url)
	
	if (!req.body.url) {
		res.render("index", {  title: titletext, errormsg : "please enter an URL" })
		return;
	}
	
	request(req.body.url, function (error, response, body) {
		  
		if (error){
			console.log(error);
			res.render('index', { title: titletext, errormsg : error });  
		}
		else if (response.statusCode == 200) {
			host = response.request.host;
			console.log("HOST: " + host);
			jsdom.env({
				html: body,
				done: function(errors, window) {
					//console.log(errors)
					//console.log(window.document.documentElement.innerHTML)
				
					res.render('index', { 
						title: titletext,  
						article : articolize(window.document, host)
					})
				},
				features: {
					QuerySelector: true
				}
			});
		
			
		}
	});
};



