/*
 * Blog - Main server
 */
 //Env variables
 require('dotenv').config();

//Required packages
const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const caseModule = require(path.join(__dirname, "caseModule.js"));  //Required local module

const app = express();

//App uses ejs to render views in views folder
app.set("view engine", "ejs");

//Body parser for requests
app.use(bodyParser.urlencoded({extended: true}));

//Allows use of static files in public directory (css, images)
app.use(express.static(path.join(__dirname, 'public')));

//Mongoose
//mongoose.connect("mongodb://localhost:27017/blog");
mongoose.connect(process.env.MONGODB_ROOT + "blog");





/******************** DATABASE CODE ********************/
//Schemas for mongodb database
const postSchema = new mongoose.Schema({

  title: String,
  imageURL: String,
  text: {

    type: String,
    required: [true, "Text required."],
    maxLength: 5000
  }
});

//Models for mongodb database
const Post = mongoose.model("Post", postSchema); //Create "posts" collection in db

let samplePost = new Post({ // Step C

  title: "Sample Title",
  imageURL: "Sample Image URL",
  text: "This is sample text."
});





/******************** SERVER ROUTES ********************/
/*
 * LISTEN route
 * process.env.port listens for Heroku server
 * local port 3000 for testing
 *
 */
app.listen(process.env.PORT || 3000, function(){

                  console.log("Running on 3000");
});





/*
 * GET ROUTES
 */
 //Home route
app.get("/", function(req, res){

  let imgs = [
    "https://via.placeholder.com/150",
    "https://via.placeholder.com/150",
    "https://via.placeholder.com/150",
    "https://via.placeholder.com/150",
    "https://via.placeholder.com/150",
    "https://via.placeholder.com/150"
  ];

  //Gets random image URLs from Posts collection to display in home page gallery
  Post.aggregate([{ $sample: { size: 6 } }], function(err, foundPosts){

    if( err ){

      console.log(err);
      res.render("home", {imgs: imgs});
    }
    else{

      //Loop through result array of aggregate function
      foundPosts.forEach( function(post, index){

        imgs[index] = post.imageURL;
      });

      res.render("home", {imgs: imgs});
    }
  });

});



//About route
app.get("/about", function(req, res){

  res.render("about");
});



//Compose new post route
app.get("/compose", function(req, res){

  res.render("compose");
});



//Route to edit currently viewed post based on query parameter postTitle
app.get("/edit/:postTitle", function(req, res){

  let postTitle = caseModule.standardFormat(req.params.postTitle);

  //Find post in database and pass to view to display
  Post.findOne({title:postTitle}, function(err, foundPost){

    if( err || foundPost == null ){

      console.log("Post not found.");
      res.redirect("/posts");
    }
    else
      res.render("edit", {postId:foundPost._id, postTitle: postTitle, postImageURL: foundPost.imageURL, postText: foundPost.text});
  });

});



//Route for all posts
app.get("/posts", function(req, res){

  //Find all posts in database and pass to view to display
  Post.find({}, function(err, foundPosts){

    if( err ){

      console.log(err);
      res.redirect("/");
    }
    else{

      res.render("posts", {heading: "All Posts", posts: foundPosts});
    }
  });

});



//Route for specific post based on query parameter postTitle
app.get("/posts/:postTitle", function(req, res){

  let postTitle = caseModule.standardFormat(req.params.postTitle);

  //Find post in database and pass to view to display
  Post.findOne({title:postTitle}, function(err, foundPost){

    if( err || foundPost == null ){

      console.log("Post not found.");
      res.redirect("/posts");
    }
    else{

      res.render("post", {postId:foundPost._id, postTitle: postTitle, postImageURL: foundPost.imageURL, postText: foundPost.text});
    }
  });

});





/*
 * POST ROUTES
 */
 //Post a blog post to the database
app.post("/compose", function(req, res){

  //Fields from post form
  let reqTitle = caseModule.standardFormat(req.body.postTitle);
  let reqImageURL = req.body.postImageURL;
  let reqText = req.body.postText;

  //Create post document to save to database
  let postToAdd = new Post({

    title: reqTitle,
    imageURL: reqImageURL,
    text: reqText
  });

  //saves postToAdd into Posts collection in db
  postToAdd.save();

  res.redirect("/posts"); //Redirect to view
});



//Search for posts containing search terms
app.post("/search", function(req, res){

  let searchString = req.body.searchTerms;

  //Break the search into individual words to query against db
  let searchArray = searchString.split(" ");
  let regex = searchArray.join("|");

  //Find posts that contain any of the search words in title or text of post
  Post.find( {$or: [ {title: {$regex:regex, $options:"i"}}, {text: {$regex:regex, $options:"i"}} ] }, function( err, results ){

      if( err ){

        console.log(err);
        res.redirect("/posts");
      }
      else{

        res.render("posts", {heading: "Search Results", posts: results});
      }
  });

});



//Edit post
app.post("/edit", function(req, res){

  let id = req.body.postId;
  console.log(id);

  //Updates post with new values in post form
  Post.updateOne({_id: id}, {title: req.body.postTitle, imageURL: req.body.postImageURL, text: req.body.postText}, function(err){

    if( err )
      console.log(err);
    else
      console.log("Updated post.");
    res.redirect("/posts");
  });

});



//Delete post
app.post("/delete", function(req, res){

  let reqId = req.body.postId;

  //Deletes post currently in view using post id
  Post.deleteOne({_id: reqId}, function(err){

    if( err )
      console.log(err);
    else
      console.log("Deleted");
    res.redirect("/posts");
  });

});
