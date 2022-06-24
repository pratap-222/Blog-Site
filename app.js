//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require("mongoose");

const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb+srv://admin_222:Pass%40123@cluster0.q8dyjim.mongodb.net/blogSiteDB");

const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

const postSchema = {
  title: String,
  content: String,
  postedAt: {
    type: String,
    default: new Date().toLocaleDateString('en', options)
  }
};

const Post = mongoose.model("Post", postSchema);

// let posts = [];

app.get("/", function(req, res) {

  Post.find({}, function(err, posts) {
    res.render("home", {
      startingContent: homeStartingContent,
      posts: posts
    });
  });
});

app.get("/about", function(req, res) {
  res.render("about", {
    aboutContent: aboutContent
    // This is the standard way of doing not "startingContent: homeStartingContent" this
  });
});

app.get("/contact", function(req, res) {
  res.render("contact", {
    contactContent: contactContent
    // This is the standard way of doing not "startingContent: homeStartingContent" this
  });
});

app.get("/compose", function(req, res) {
  res.render("compose");
});

app.post("/compose", function(req, res) {
  const post = new Post({
    title: req.body.postTitle,
    content: req.body.postBody
    // event: req.body.date;
  });

  // posts.push(post);
  post.save(function(err) {
    if (err){
      console.log(err);
    }

    else{
      res.redirect("/");
    }
  });

});

app.get("/posts/:postId", function(req, res) {
  // console.log(req.params.postName);
  let requestPostId = req.params.postId;

  Post.findOne({_id: requestPostId}, function(err, post) {
    res.render("post", {
      title: post.title,
      content: post.content
      // event: post.event
    });
  });

  // posts.forEach(function(post) {
  //   if (_.lowerCase(requestTitle) === _.lowerCase(post.title)){
  //
  //   }
  // })
});

app.get("/delete/:postId", function(req, res) {
  // console.log(req.params.postName);
  let requestPostId = req.params.postId;

  Post.deleteOne({_id: requestPostId}, function(err, post) {
    if (!err) {
      console.log("Successfully deleted the Post");
      res.redirect("/");
    }

    else {
      console.log(err);
    }
  });
});


app.get("/edit/:postId", function(req, res) {
  // console.log(req.params.postName);
  let requestPostId = req.params.postId;

  Post.findOne({_id: requestPostId}, function(err, post) {
    res.render("edit", {
      title: post.title,
      content: post.content,
      _id: requestPostId
    });
  });
});

app.post("/edit/:postId", function(req, res) {

  const title = req.body.postTitle;
  const content = req.body.postBody;

  let requestPostId = req.params.postId;

  Post.updateOne({_id: requestPostId}, { $set: {title: title, content: content}})
  .then(() => {
    console.log("Successfully updated the Post");
    res.redirect("/");
  })
  .catch(err => console.log(err));

});






app.listen(3000, function() {
  console.log("Server started on port 3000");
});
