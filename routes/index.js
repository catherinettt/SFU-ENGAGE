var http = require('http');
var request = require('request');
var fs = require('fs');
var jsdom = require('jsdom'), html5 = require('html5');

var article_1 = {
	id : 1,
	url : "http://www.bbc.co.uk/news/science-environment-18716300",
	title :  "1South Korea unveils 'scientific' whaling proposal",
	author: "Richard Black",
	published_date : "4 July 2012",
	host : "http://www.bbc.co.uk",
	path : "/news/science-environment-18716300.html",
	uploaded_by : "Catherine Tan",
	uploaded_on : "May 6 2012,  12:30 PM PST"
}

var article_2 = {
	id : 2,
	url : "http://blog.spoongraphics.co.uk/tutorials/how-to-create-an-abstract-geometric-mosaic-text-effect",
	title :  "How To Create an Abstract Geometric Mosaic Text Effect",
	author: "Chris Spooner",
	published_date : "4 July 2012",
	host : "http://blog.spoongraphics.co.uk",
	path : "/news/how-to-create-an-abstract-geometric-mosaic-text-effect.html",
	uploaded_by : "Catherine Tan",
	uploaded_on : "Jun 6 2012,  12:30 PM PST"
}

var article_3 = {
	id : 3,
	url : "http://www.bbc.co.uk/news/science-environment-18716300",
	title :  "3South Korea unveils 'scientific' whaling proposal",
	author: "Richard Black",
	published_date : "4 July 2012",
	host : "http://www.bbc.co.uk",
	path : "/news/science-environment-18716300.html",
	uploaded_by : "Catherine Tan",
	uploaded_on : "July 12 2012,  12:30 PM PST"
}


var article_4 = {
	id : 4,
	url : "http://www.bbc.co.uk/news/science-environment-18716300",
	title :  "4South Korea unveils 'scientific' whaling proposal",
	author: "Richard Black",
	published_date : "4 July 2012",
	host : "http://www.bbc.co.uk",
	path : "/news/science-environment-18716300.html",
	uploaded_by : "Catherine Tan",
	uploaded_on : "July 12 2012,  12:30 PM PST"
}

var article_5 = {
	id : 5,
	url : "http://www.forbes.com/sites/victorlipman/2012/06/28/how-to-interview-effectively",
	title :  "How To Interview Effectively",
	author: "Victor Lipman",
	published_date : "28 June 2012",
	host : "http://www.forbes.com",
	path : "/news/how-to-interview-effectively.html",
	uploaded_by : "Catherine Tan",
	uploaded_on : "July 15 2012,  12:30 PM PST",
	course: "cmpt120",
	week : "3",
	
}


var articles = [article_1,  article_2,  article_3,  article_4,  article_5]

var userobject = {
	name : "Catherine Tan",
	id : 301078676,
	courses : {
		"CMPT 120" : [article_1, article_2],
		"BUS 100" : [article_4],
		"IAT 200" : [article_3, article_5, article_1]
		}
	}

function mediaPath(path, host){
	if (path.charAt(0)== "/"){
		return "http://" + host + path;
	}
	else return path;
}

function walk(node, cb) {

	var check = false;
	if (node.nodeType !== node.ELEMENT_NODE) {
		return;
	}

	for(var i = 0; i < node.childNodes.length; ++i){
		if (node.childNodes[i].tagName === 'SCRIPT' || node.childNodes[i].tagName === 'NOSCRIPT') {
			node.removeChild(node.childNodes[i]);
		}
		else if (node.childNodes[i].textContent.length/node.textContent.length > 0.55) {	
			walk(node.childNodes[i], cb);
			check = true;
		}
	}

	if (!check) {
		cb(node); 
	}
}

function listTypes(node) {
	var article = null

	walk(node, function(node) {
		for (var j = 0; j < node.childNodes.length; ++j) {
			var current = node.childNodes[j];
			//console.log('child node: '+current)
			if (current.nodeType === current.ELEMENT_NODE) {
				current.removeAttribute('class');
				current.removeAttribute('id');
				current.removeAttribute('style');
			}
		}		
		article = node;		
	})
	return article;
}

/*
function articlize(document) {
	var article = listTypes(document.documentElement)
}
*/

function get_article(document, name) {

	var stream = fs.createWriteStream("./public/news/"+name+".xml");
	stream.once('open', function(fd) {

		stream.write('<title>'+document.querySelector('H1').textContent+'</title>\n')
		stream.write('<content>'+html5.serialize(listTypes(document.documentElement))+'</content>');

	})
/*
	//for testing----------------
	return document.querySelectorAll(tag).map(function(node) {
		return "<p>"+node.textContent+"</p>";
	}).join("");
	//---------------------------
*/
}





exports.index = function(req, res){
	

	if (!req.body.article_url) {
		var error = "";
		if (req.method === 'POST') {
			error ="please enter an URL" ;
		}
		res.render("index", { 	title: "SFU ENGAGE",
							user :  userobject, 
							status : "logged in",
							errormsg : error })
		return;
	}

	//var pathname = req.body.article_url.substring(0,pathname.lastIndexOf("/"));
	//console.log(req.body.article_url.split("/"));
	var parse_url = req.body.article_url.split("/");

	request(req.body.article_url, function (error, response, body) {
		if (response.statusCode == 200) {	
			var 
				window = jsdom.jsdom(null, null, {
					parser: html5,
					features: {
						QuerySelector: true
					}
				}).createWindow(),
				parser = new html5.Parser({document: window.document});

			parser.parse(body);

			get_article(window.document, parse_url[parse_url.length-1]);
			
		}
		
		res.render("index", { 	title: "SFU ENGAGE",
								user :  userobject, 
								status : "logged in",
								errormsg : error })
	});
};

exports.article_view = function(req, res){
	var pickedArticle = articles[req.params.id - 1];
	
	res.render("article", { title: "SFU ENGAGE",
							article : pickedArticle,
							user :  userobject,  
							status : "logged in"	 })
}


