/* Scraper
 * backend
 * ==================== */

// Dependencies
var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongojs = require("mongojs");
var mongoose = require("mongoose");
// Bring in our Models
var Note = require("./models/Note.js");
var Articles = require("./models/Articles.js");
var savedArticles = require("./models/SavedArticles.js")
//========================================================
var exphbs = require("express-handlebars");
// Require request and cheerio. This makes the scraping possible
var request = require("request");
var cheerio = require("cheerio");
// Mongoose mpromise deprecated - use bluebird promises
var Promise = require("bluebird");

// Initialize Express
var app = express();

// Configure our app for morgan and body parser
app.use(logger("dev"));
app.use(bodyParser.urlencoded({
  extended: false
}));

// Set Handlebars as the default templating engine.
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// Static file support with public folder
//app.use(express.static("public"));

// Database configuration with mongoose
mongoose.connect("mongodb://localhost/newsDb");
var db = mongoose.connection;

// Show any mongoose errors
db.on("error", function(error) {
  console.log("Mongoose Error: ", error);
});

// Once logged in to the db through mongoose, log a success message
db.once("open", function() {
  console.log("Mongoose connection successful.");
});

// Static directory
app.use(express.static("./public"));


// Routes
// ======
app.get('/', function(req, res) {
  res.render("news");
});

// Scrape data from one site and place it into the aritcle model.
app.get("/api/scrapedNews", function(req, res) {
  // Make a request for the news section of ycombinator
  request("https://news.ycombinator.com/", function(error, response, html) {
    // Load the html body from request into cheerio
    var $ = cheerio.load(html);
    // For each element with a "title" class
    $(".title").each(function(i, element) {
      // Save the text of each link enclosed in the current element
      var title = $(this).children("a").text();
      // Save the href value of each link enclosed in the current element
      var link = $(this).children("a").attr("href");

      // If this title element had both a title and a link
      if (title && link) {
        //create new article model
        var newArticle = new Articles({
          title: title,
          link: link
        });
        // Save the data in the news db
        newArticle.save(function(error, doc) {
          if(error) {
            console.log(error);
          }
          else {
            console.log(doc);
          }
        });
      }
  });
  // This will send a "Scrape Complete" message to the browser
  //res.json(dataArr);
  res.redirect("/results");
  });
});

app.get("/results", function(req, res) {
  // Find all results from the scrapedData collection in the db
  Articles.find({}, function(error, doc) {
    // Throw any errors to the console
    if (error) {
      res.send(error);
    }
    // If there are no errors, render the results via handlebars.
    else {
      res.render("results", {stories: doc});
    }
  });
});
// Retrieve data from the db
app.get("/api/all", function(req, res) {
  // Find all results from the scrapedData collection in the db
  db.stories.find({}, function(error, found) {
    // Throw any errors to the console
    if (error) {
      console.log(error);
    }
    // If there are no errors, send the data to the browser as a json
    else {
      res.json(found);
    }
  });
});
// Retrieve data from the savedStroies collection
app.get("/savedArticles", function(req, res) {
  // Find all results from the scrapedData collection in the db
  db.savedStories.find({}, function(error, found) {
    // Throw any errors to the console
    if (error) {
      console.log(error);
    }
    // If there are no errors, send the data to the browser as a json
    else {
      res.render("savedArticles", {stories: found});
    }
  });
});

// Route to save an article from the scraped results.
app.get("/saveArticle/:id", function(req, res) {
  console.log("*******" + req.params.id);
  Articles.find({_id: req.params.id}, function(error, doc) {
    // Send any errors to the browser
    if (error) {
      console.log(error);
    }
    // Or send the doc to the browser
    else {
      console.log(doc);
      //create a new model from savedArticles.
      var savedArticle = new savedArticles({
          title: doc.title,
          link: doc.link
      });
      // Save the data in the news db
      savedArticle.save(function(error, doc) {
        if(error) {
          console.log(error);
        }
        else {
          console.log(doc);
        }
      });
    }
  });
  // var newSavedArticle = new SavedArticles({
  //                 title: title,
  //                 link: link
  //               });
  
});
app.get("/api/delete/:id", function(req, res) {
    //console.log("got inside the delete route");
    db.savedStories.remove({ "_id": mongojs.ObjectId(req.params.id) 
    }, function(error, deleted) {
      if(error) {
        console.log(error);
      }
      else {
        res.send(deleted);
      }
    });
});
app.get("/api/updateArticle/:id", function(req, res) {

})
// Listen on port 3000
app.listen(3000, function() {
  console.log("App running on port 3000!");
});
