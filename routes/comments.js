var express=require("express");
var router=express.Router();
var Campground=require("../models/schemacamp");
var Comment=require("../models/comment");

router.get("/campgrounds/:id/comments/new",isLoggedIn,function(req,res){
	console.log(req.params.id);
	Campground.findById(req.params.id,function(err,campground){
		if(err){
console.log(err);
		}
		else{
			console.log(req.params.id);
			res.render("commentform",{campground:campground});
		}
	})
     
})
router.post("/campgrounds/:id/comments",function(req,res){
	Campground.findById(req.params.id,function(err,campground){
		if(err){
			console.log(err);
		}
		else{
          var author=req.body.imp3;
		  var text=req.body.imp4;
		var newComment={author:author,text:text};
			Comment.create(newComment,function(err,comment){
				if(err){
					console.log(err);
				}
				else{
					comment.author.id=req.user._id;
					comment.author.username=req.user.username;
					comment.save();
					campground.comments.push(comment);
					campground.save();
					req.flash("success","Successfully added a comment");
					res.redirect('/campgrounds/' + campground._id);
				}
			})
			
		}
	})
})
function isLoggedIn(req,res,next){
	if(req.isAuthenticated()){
	       return next();
	   }
	res.redirect("/login");
}
module.exports=router;