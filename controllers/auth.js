const User = require("../models/user");
const bcrypt = require('bcryptjs');
const { authPlugins } = require("mysql2");
const nodemailer = require('nodemailer');
const sendgridTransport = require("nodemailer-sendgrid-transport");


// const transporter = nodemailer.createTransport(sendgridTransport({
//   auth:{
//     api_key: 'YOUR_API_KEY'
//   }
// }));
exports.getLogin = (req, res, next) => {
  res.render("auth/login", {
    pageTitle: "Login",
    path: "/login",
    editing: false,
    isAuthenticated: false,
    errorMessage: req.flash('error')
  });
};

exports.postLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  User.findOne({email:email})
    .then((user) => {
      if(!user){
        req.flash('error','Invalid email');
        return res.redirect('/login');
      }
      bcrypt.compare(password,user.password)
      .then(doMatch=>{
        if(doMatch){
          req.session.user = user;
          req.session.isLoggedIn = true;
          return req.session.save((err) => {
            console.log(err);
            res.redirect("/");
          });
        }
        res.redirect('/login');
      })
      
    })
    .catch((err) => console.log(err));
};

exports.postLogout = (req, res, next) => {
  //csurf package by default search for csrf token for any operation that manipulates data like post requests for that we need to pass the csrf token for each post method
  req.session.destroy(() => {
    res.redirect("/");
  });
};

exports.getSignup = (req, res, next) => {
  res.render("auth/signup", {
    pageTitle: "Sign Up",
    path: "/signup",
    editing: false,
    isAuthenticated: false,
  });
};

exports.postSignup = (req, res, next) => {
    const email = req.body.email;
    const password =  req.body.password;
    const cpassword =  req.body.cpassword;
    User.findOne({email:email})
    .then(userDoc=>{
      if(userDoc){
        return res.redirect('/signup');
      }
      else{
        return bcrypt.hash(password,12)
        .then(hashedPassword=>{
          const user = new User({
            email: email,
            password:hashedPassword,
            cart:{items:[]}
          });
          return user.save();
        })
       .then(result=>{
        res.redirect('/login');
       });
      }
    })
   .catch(err=>console.log(err));
};
