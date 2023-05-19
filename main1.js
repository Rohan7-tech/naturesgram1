var express=require("express");
var app=express();
var bodyparser=require("body-parser");
var Campground = require("./models/schemacamp");
var Comment=require("./models/comment");
var passport=require("passport");
var User =require("./models/user");
var localstrategy=require("passport-local");
//var User =require("./models/user");
var commentRoutes=require("./routes/comments");
var campgroundRoutes=require("./routes/campgrounds");
var indexroutes=require("./routes/index");
var methodoverride=require("method-override");
var flash=require("connect-flash");
app.use(bodyparser.urlencoded({extended:true}));
app.set("view engine","ejs");
app.use("/public",express.static("public"));
app.use(methodoverride("_method"));
app.use(flash());
var mongoose=require("mongoose");
mongoose.connect("mongodb+srv://rohankhilnani:Rohan@2508@yelpcamp.xi13x.mongodb.net/?retryWrites=true&w=majority",{useNewUrlParser:true , useUnifiedTopology:true});

app.use(require("express-session")({
		 secret:"Cool Rusty",
	      resave:false,
	      saveUninitialized:false
	
		}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localstrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req,res,next){
	res.locals.currentUser=req.user;
	res.locals.error=req.flash("error");
	res.locals.success=req.flash("success");
	next();
})	
app.use(campgroundRoutes);
app.use(commentRoutes);
app.use(indexroutes);

let port=12345
app.listen(port,function(){
	console.log("Server is now started");
	
})