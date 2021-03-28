//Load in environment variables
if(process.env.NODE_ENV !== 'production'){
  require('dotenv').config()
}

const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
const initializePassport = require('./passport-config');
const passport = require('passport');
const flash = require('express-flash');
const session = require('express-session');
const { request, response } = require('express');
const methodOverride = require('method-override');

initializePassport(
  passport,
  email => users.find(user => user.email === email),
  id =>  users.find(user => user.id === id)
);

const users = [];

app.set('view-engine', 'ejs');
//want to access the input information in our request variable inside the post method
app.use(express.urlencoded({extended:false}));
app.use(flash())
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave:false,
  saveUninitialized: false
}))

app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride('_method'))

//set up route, homepage route = '/'
app.get('/', checkAuthenticated,(request, response) => {
  //shows the code from index.ejs
  response.render('index.ejs', {name: request.user.name})
});

//route to login page
app.get('/login', checkNotAuthenticated, (request, response)=>{
  response.render('login.ejs')
})
//route to register page
app.get('/register', checkNotAuthenticated,(request, response)=>{
  response.render('register.ejs')
})

app.post('/login', checkNotAuthenticated ,passport.authenticate('local',{
successRedirect: '/',
failureRedirect: '/login',
failureFlash: true
}))

app.post('/register', checkNotAuthenticated ,async(request, response)=>{
  try {
    //10 = how many times the password should be hashed(how secure)
    const hashedPassword = await bcrypt.hash(request.body.password, 10)
    users.push({
      id: Date.now().toString(),
      name: request.body.name,
      email: request.body.email,
      password: hashedPassword
    })
    //if registering is succesfull
    //redirect to login page
    response.redirect('/login')
  } catch{
    //if for some reason it fails redirect to register
    response.redirect('/register')
  }
  //shows the registered user in the terminal
  console.log(users);
})

//logout
app.delete('/logout', (request, response) =>{
  request.logOut(); //passport sets it up automatically
  response.redirect('/login');
})

//middleware function
function checkAuthenticated(request, response, next){
  if (request.isAuthenticated()){
    return next()
  }
  response.redirect('/login')
}

function checkNotAuthenticated(request, response, next){
  if (request.isAuthenticated()){
    return response.redirect('/');
  }
  next();
}

//what port the app is running (localhost:3000)
app.listen(3000);
