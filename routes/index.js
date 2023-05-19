var express=require("express");
var router=express.Router();
var passport=require("passport");
var User=require("../models/user");
router.get("/",function(req,res){
	res.render("main.ejs");
})
router.get("/register",function(req,res){
    res.render("register");
})
router.post("/register",function(req,res){
	var newUser=new User({username:req.body.username});
	User.register(newUser,req.body.password,function(err,user){
		if(err){
			res.send("Please try to sign up with some different credentials");
			console.log(err);
			
			
		}
		passport.authenticate("local")(req,res,function(){
			req.flash("success","Welcome to NaturesGram");
			res.redirect("/campgrounds");
		})
	})
});
router.get("/login",function(req,res){
	res.render("login");
	
})
router.post("/login",passport.authenticate("local",{successRedirect:"/campgrounds",failureRedirect:"/login"}),function(req,res){
	
})
router.get("/logout",function(req,res){
	req.flash("success","Logged you out!!!!");
	req.logout();
	
	res.redirect("/campgrounds");
})
function isLoggedIn(req,res,next){
	if(req.isAuthenticated()){
	       return next();
	   }
	req.flash("error","You need to login first!!!");
	res.redirect("/login");
}
module.exports=router;