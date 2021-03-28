# Login Authentication Guide

### Stack
* express / express-session / express-flash
    * Application server
* Dotenv
    * environment variables we can load in to our server
* nodemon
    * restart server automatically
* ejs
    * Template impelmentation
* bcrypt
    * Allows us to hash passwords and compare hashed passwords
* passport / passport-local
    * For authentication
* method-override
    * allows us to overrides methods, like post and call delete instead

### Scripts:
* add "dev": "nodemon server.js" 
    * this will automatically restart the server via nodemon, when changes have been made in server.js file. 

### .gitignore
* add .env (we don't want to push our secret variables to the public)
* add node_modules

