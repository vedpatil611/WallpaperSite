const express = require("express");
const app = express();
const mysql = require("mysql");
const bodyParser = require("body-parser");
const multer = require("multer");
const ejs = require('ejs');
const upload = multer({ dest: 'uploads/'});

const database = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "password",
  database: "wallpaper"
});


app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
// app.use(methodOverride("_method"));

app.get("/", function (req, res) {
	database.query("SELECT title, data FROM images", function(err, result) {
		// res.send(result);
		obj = JSON.parse(JSON.stringify(result));
		console.log(obj);
		res.render("home", {obj: obj});
	});
	// res.render("home");
});

app.get("/upload", function (req, res) {
	res.render("upload");
});

app.post("/upload", upload.single('path'), function (req, res) {
	var title = req.body.title;
	temp = __dirname + "/" + req.file.path;
	var path = temp.replace(/\\/g, "/");
	console.log(path);

	database.query("INSERT INTO images(title, data) VALUES(\"" + title + "\", LOAD_FILE(\"" + path + "\"))");
	res.redirect("/");
});

app.get("/show", function(req, res) {
	database.query("SELECT title, data FROM images", function(err, result) {
		// res.send(result);
		obj = JSON.parse(JSON.stringify(result));
		console.log(obj);
		res.render("show", {obj: obj});
	});
});

app.listen(8000, function() {
	console.log("Hello there");
});