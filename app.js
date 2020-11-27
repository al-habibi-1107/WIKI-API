const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const ejs = require('ejs');


const app = express();

app.set('view engine','ejs');

app.use(bodyParser.urlencoded({extended:true}));




app.use(express.static('public'));


mongoose.connect("mongodb://localhost:27017/wikiDB",{useNewUrlParser:true,useUnifiedTopology:true});

const articleSchema = {
    title : String,
    content: String
};

const Articles = mongoose.model('Article',articleSchema);

//////////////////////////////////////Requests targeting a all article////////////////////////////////

app.route('/articles')

.get(function(req,res){
    Articles.find(function(err,foundArticles){
        //console.log(foundArticles);
        if(!err){

            res.send(foundArticles);
        }else{
            res.send(err);
        }
    });

})

.post(function(req,res){
    const newArticle = new Articles({
        title: req.body.title,
        content: req.body.content
    });
    newArticle.save(function(err){
        if(!err){
            res.send("Success");
        }else{
            res.send(err);
        }
    });
})

.delete(function(req,res){
    Articles.deleteMany(function(err){
        if(!err){
            res.send("Successfully Deleted all");
        }else{
            res.send(err);
        }
    });
})

//////////////////////////////////////Requests targeting a specific article////////////////////////////////

app.route('/articles/:articleTitle')
.get(function(req,res){
    var artTitle = req.params.articleTitle;

    Articles.findOne({'title':artTitle },function(err,foundArticle){
        if(foundArticle){
            res.send(foundArticle);
        }else{
            res.send("No articles of the name found");
        }
    });
})
.put(function(req,res){

    var artTitle = req.params.articleTitle;

    Articles.updateOne({'title':artTitle},{title: req.body.title,content: req.body.content},{overwrite:true},function(err){
        if(!err){
            res.send("Entry Updated Successfully");
        }else{
            res.send(err);
        }
    });
})

.patch(function(req,res){

    var artTitle = req.params.articleTitle;

    Articles.updateOne({title:artTitle},{$set:req.body},function(err){
        if(!err){
            res.send("Sucessfully Updated");
        }else{
            res.send(err);
        }
    });
})

.delete(function(req,res){
    var artTitle = req.params.articleTitle;

    Articles.deleteOne({title: artTitle},function(err){
        if(!err){
            res.send("Successfully Deleted");
        }
        res.send(err);
    });
});


app.listen(3000,function(){
    console.log("server running at port 3000...");
});

