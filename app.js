const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const csrf = require('csurf');
const flash = require('connect-flash');

const path = require("path");
const errorController = require("./controllers/error");
const User = require("./models/user");

const app = express();

const store = new MongoDBStore({
  uri: "mongodb+srv://shethdeep12:wjpZ0JdClRR6JkPl@cluster0.mydnjgq.mongodb.net/shop?retryWrites=true&w=majority&appName=Cluster0",
  collection: "sessions",
});

const csrfProtection = csrf();

app.set("view engine", "ejs");
app.set("views", "views");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const authRoutes = require("./routes/auth");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
app.use(
  session({ secret: "my secret", saveUninitialized: false, resave: false , store:store })
);

app.use(csrfProtection);
app.use(flash());

app.use((req, res, next) => {
    if(!req.session.user){
        return next();
    }
  User.findById(req.session.user._id)
    .then((user) => {
      req.user = user;
      next();
    })
    .catch((err) => console.log(err));
});

app.use((req,res,next)=>{
  res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.csrfToken = req.csrfToken();
  next();
}) 

app.use("/admin", adminRoutes); 
app.use(shopRoutes);
app.use(authRoutes);

app.use(errorController.get404Page);

mongoose.connect('mongodb+srv://shethdeep12:wjpZ0JdClRR6JkPl@cluster0.mydnjgq.mongodb.net/shop?retryWrites=true&w=majority&appName=Cluster0')
.then(result=>{
    User.findOne().then(user=>{
        if(!user){
            const user = new User({
                name:"Deep",
                email:"deep@test.com",
                cart:{
                    items:[]
                }
            });
            user.save();
        }
    })
    app.listen(3001);
    console.log("connected!");
}).catch(err=>console.log(err));
