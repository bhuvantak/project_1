var express = require('express');
var router = express.Router();
const userModel=  require('./users');
const postModel= require('./posts');
const localStrategy=require('passport-local');
const passport = require('passport');
const upload=require('./multer');
passport.use(new localStrategy(userModel.authenticate())); // in dono lines se user login hota hai


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
router.get('/login', function(req, res, next) {
  res.render('login',{error:req.flash('error')});
});
router.get('/feed', function(req, res, next) {
  res.render('feed');
});
router.post('/upload',isloggedIn,upload.single('file') ,async function(req, res, next) {
  if(!req.file){
    return res.status(400).send("files were not uploaded");

  }
  const user = await userModel.findOne({username: req.session.passport.user})
  const postData=await postModel.create({
    image:req.file.filename,
    postText:req.body.filecaption,
    user:user._id,
  });
  user.posts.push(postData._id);
  await user.save();
  res.redirect("/profile")
});

router.get("/profile",isloggedIn,async(req,res,next)=>{
  const user= await userModel.findOne({
    username:req.session.passport.user

  })
  .populate("posts");
  res.render("profile",{user});
})

router.post('/register',(req,res)=>{
  const { username, email, fullname } = req.body;
const userData = new userModel({ username, email, fullname });

userModel.register(userData,req.body.password)
.then(()=>{
  passport.authenticate("local")(req,res,function(){
    res.redirect("/profile");
  })
})
})

router.post('/login',passport.authenticate("local",{
  successRedirect:"/profile",
  failureRedirect:"/login",
  failureFlash:true,
}),(req,res)=>{
  
})

router.get('/logout',(req,res)=>{
  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect('/');
  });
})
function isloggedIn(req,res,next){
  if(req.isAuthenticated() ) return next();
  res.redirect("/login")
}
module.exports = router;
