var express=require("express");
var router=express.Router();
var Campground=require("../models/schemacamp");


router.get("/",function(req,res){
	res.render("main.ejs");
})
router.get("/campgrounds",function(req,res){
	Campground.find({},function(err,allcamp){
		if(err){
			console.log("Error");
		}
		else{
			res.render("campgrounds.ejs",{campgrounds:allcamp});
		}
	})
	//res.render("campgrounds",{campgrounds:campgrounds})
})
router.post("/campgrounds",isLoggedIn,function(req,res){
	    var name1=req.body.imp;
	var image1=req.body.imp1;
	var descrip=req.body.imp2;
	var author= {
		id:req.user._id,
		username:req.user.username
	}
	    var newCamp={name:name1,image:image1,description:descrip,author:author};
	    
	Campground.create(newCamp,function(err,newCreated){
              if(err){
				  
				  console.log("Error");
			  }
		else{
			req.flash("success","You have successfully added an image");
			console.log(newCreated);
			res.redirect("/campgrounds");
		//	res.redirect("/campgrounds");
		}
	
	})
	  //  campgrounds.push(newCamp);
	  // res.redirect("/campgrounds");
})
router.get("/campgrounds/new",isLoggedIn,function(req,res){
     res.render("new.ejs");
})
router.get("/campgrounds/:id",function(req,res){
	 console.log(req.params.id);
	Campground.findById(req.params.id).populate("comments").exec(function(err,foundcamp){
		if(err){
console.log(err);}
		else{
			console.log(foundcamp);
			res.render("temp.ejs",{campgrounds:foundcamp})
		}
	})
	
	
})
router.get("/campgrounds/:id/edit",ownership,function(req,res){
	   Campground.findById(req.params.id,function(err,foundCampground){
	          if(err){
				  console.log(err);
			  }
		      else{
			
			   res.render("edit",{campground:foundCampground});
			  }
	 
	
}); 
});
	
       
router.put("/campgrounds/:id",ownership,function(req,res){
	var data={name: req.body.imp, image: req.body.imp1,description:req.body.imp2}
	Campground.findByIdAndUpdate(req.params.id,data,function(err,updatedcamp){
		if(err){
			res.redirect("/campgrounds")
		}
		else{
			res.redirect("/campgrounds/"+req.params.id);
		}
	})
})
router.delete("/campgrounds/:id",ownership,function(req,res){
	Campground.findByIdAndRemove(req.params.id,function(err){
		if(err){
			res.redirect("/campgrounds");
		}
		else{
			res.redirect("/campgrounds");
		}
	})
})
function ownership(req,res,next){
	if(req.isAuthenticated()){
	   Campground.findById(req.params.id,function(err,foundCampground){
		if(err){
			res.redirect("back");
		}
		else{
			if(foundCampground.author.id.equals(req.user._id)){
			   next();
			   }
			else{
				req.flash("error","You do not have the permission Sorry!!!");
				res.redirect("back");
			}
		}
	   
	   });
	}
	else{
		req.flash("error","You need to get logged in to do that");
		res.redirect("back");
		
	}
}
function isLoggedIn(req,res,next){
	if(req.isAuthenticated()){
	       return next();
	   }
	req.flash("error","Please login first");
	res.redirect("/login");
}
	module.exports=router;


