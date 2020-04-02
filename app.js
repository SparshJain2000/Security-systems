var express = require("express"),
    expressSanitizer = require("express-sanitizer"),
    methodOverride = require("method-override"),
    mongoose = require("mongoose"),
    bodyParser = require("body-parser"),
    passport = require("passport"),
    LocalStrategy = require("passport-local").Strategy,
    middleware = require("./middleware"),
    User = require("./models/user"),
    path = require("path"), //linking stylesheet
    env = require("dotenv");
env.config();

app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride("_method")); //overriding
app.use(
    require("express-session")({
        secret: process.env.SECRET,
        resave: false,
        saveUninitialized: false
    })
);
app.use(function(req, res, next) {
    res.locals.currentUser = req.body;
    // console.log(res.localscurrentUser);
    next();
});
//////////
app.use(passport.initialize());
app.use(passport.session());
passport.use("local", new LocalStrategy(User.authenticate()));
// passport.use(new LocalStratergy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
////////////
app.use(expressSanitizer());
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public"))); //linking stylesheet
mongoose.connect(process.env.DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

var blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: { type: Date, default: Date.now }
});
var Blog = mongoose.model("Blog", blogSchema);
var log = false;
var name = "";

app.get("/", function(req, res) {
    res.render("home", { message: "" });
});
app.get("/login", function(req, res) {
    res.render("login", { message: "" });
});
app.get("/admin", middleware.isLoggedIn, function(req, res) {
    res.render("opt");
});
app.post(
    "/",
    passport.authenticate("local", {
        successRedirect: "/admin",
        failureRedirect: "/login"
    }),
    function(req, res) {}
);

app.get("/logout", function(req, res) {
    req.logout();
    res.redirect("/");
});

app.get("/newUser", function(req, res) {
    res.render("sign");
});
app.post("/newUser", function(req, res, next) {
    var newUser;
    if (req.body.id === process.env.ID) {
        console.log(req.body.user);
        newUser = new User({
            username: req.body.user.username,
            first_name: req.body.user.first_name,
            last_name: req.body.user.last_name
        });
        // console.log(req.body.user.password);
        console.log(newUser);
        User.register(newUser, req.body.user.password, function(err, user) {
            if (err) {
                console.log(err);
                return res.render("sign");
            }
            // passport.authenticate("local")(req, res, function() {
            //     // req.flash('success', 'Welcome ' + user.username);
            //     res.redirect("/admin");
            // });
            res.redirect("/login");
            // next();
        });
    } else {
        res.render("login", { message: "Incorrect Id" });
    }
});
app.get("/users", middleware.isLoggedIn, function(req, res) {
    Blog.find({}, function(err, users) {
        if (!err) {
            res.render("index", { blogs: users, name: name });
        } else {
            console.log("ERROR: " + err);
        }
    });
});
app.post("/users", middleware.isLoggedIn, function(req, res) {
    req.body.blog.body = req.sanitize(req.body.blog.body);
    Blog.create(req.body.blog, function(err, newBlog) {
        if (!err) {
            res.redirect("/users");
        } else {
            res.render("new", { name: name });
        }
    });
});
app.get("/users/new", middleware.isLoggedIn, function(req, res) {
    res.render("new", { name: name });
});
app.get("/users/:id", middleware.isLoggedIn, function(req, res) {
    Blog.findById(req.params.id, function(err, foundBlog) {
        if (!err) {
            res.render("show", { blog: foundBlog, name: name });
        } else {
            res.redirect("/users");
        }
    });
});

var port = process.env.PORT || 8080;
app.listen(port, function() {
    console.log("Listening to poison security " + port);
});
