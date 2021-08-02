

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/wikiDB",{useNewUrlParser:true, useUnifiedTopology:true});

const articleSchema={
    title:String,
    content:String
};

const Article=mongoose.model("Article",articleSchema);

app.route("/articles")
    .get(function(req,res){
        Article.find(function(err,foundArticles){
            res.send(foundArticles);
        })
    })
    .post(function(req,res){
        const x=req.body.title;
        const y=req.body.content;

        console.log(x);
        console.log(y);
        const newArticle= new Article({
            title: req.body.title,
            content: req.body.content
        });
        newArticle.save(function(err){
            if(!err){
                console.log("Succes");
            }
            else{
                console.log(err);
            }
        });
    })
    .delete(function(req,res){
        Article.deleteMany({},function(err){
            if(!err){
                res.send("deleted");
            }
            else{
                console.log(err);
            }
        })
    })

app.route("/articles/:articletitle")

.get(function(req,res){
    Article.findOne({title: req.params.articletitle},function(err,found){
        if(!err){
            res.send(found);
        }
        else{
            res.send("X");
        }
    })
})

.put(function(req,res){
    Article.update({title:req.params.articletitle},
        {title:req.body.title, content:req.body.content},
        {overwrite:true},
        function(err){
            if(!err){
              res.send("succes");  
            }
        }
    )
})
.patch(function(req,res){
    Article.update({title:req.params.articletitle},
        {$set:req.body},
        function(err){
            if(!err){
                res.send("success");
            }
        }
    )
})
.delete(function(req,res){
    Article.deleteOne({title:req.params.articletitle},
        function(err){
            if(!err){
                res.send("success");
            }
        })
})


app.listen(3000, function() {
  console.log("Server started on port 3000");
});


