var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const passport = require('passport')
const GitHubStrategy = require('passport-github').Strategy
const cookieSession = require('cookie-session')
var app = express();

app.use(passport.initialize())

app.get('/auth/github', passport.authenticate('github'));

passport.use(new GitHubStrategy(
  {
    clientID: '0fc79d445dd293329cf7',
    clientSecret: '693ff0f2e5b5a2fc1d7444d0d5a357aeecedcf7a',
    callbackURL: 'http://localhost:3000/auth/github/callback',
    userAgent: 'o-auth-github-practice.http://localhost:3000'
  },

  // will be filled in later
  function() {
  }
));

app.get('/auth/github/callback',
  passport.authenticate('github', { successRedirect: '/',
                                      failureRedirect: '/login' }))

passport.use(new GitHubStrategy(
   {
     clientID: '0fc79d445dd293329cf7',
     clientSecret: '693ff0f2e5b5a2fc1d7444d0d5a357aeecedcf7a',
     callbackURL: 'http://localhost:3000/auth/github/callback',
     userAgent: 'o-auth-github-practice.http://localhost:3000'
   },

   // This function gets called after the GitHub API call returns
   function onSuccessfulLogin(token, refreshToken, profile, done) {
     let user = 'Torrey'
     // This is a great place to find or create a user in the database
     // This function happens once after a successful login

     // Whatever you pass to `done` gets passed to `serializeUser`
     done(null, {token, user});
   }
 ));

app.use(cookieSession({ secret: 'iforgot' }));

// this wires up passport's session code to your session
app.use(passport.session())

passport.serializeUser((object, done) => {
  done(null, {token: object.token})
})

passport.deserializeUser((object, done) => {
    done(null, object)
})

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
