
// in index.js contains the flow of the project 

// import module 
const express = require('express');  // for route
const mongoose = require('mongoose'); // for database connection
const { Template } = require('ejs');  // this for template view engin
const session = require('express-session'); // this is for middleware
require('dotenv').config(); // this is for dotenv file




// call express 
const  app = express();   // here we call the express functions
const PORT = process.env.PORT || 4001;  // here we use the .env file for safety and if it is not  wark then we will use default port 4000;

app.use(express.static("assets"));


// Connect to MongoDB
mongoose.connect(process.env.DB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Check if the connection was successful
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});



// middleware 
app.use(express.urlencoded({extended:false}));
app.use(express.json());
app.use(
  session({
    secret:"my secret key",
    saveUninitialized:true,
    resave:false,
  })
);

app.use((req,res,next)=>{
  res.locals.message;
  delete  req.session.message;
  next();
})




// set Template  engine 
app.set('view engine','ejs');




// route for handling HTTP GET/POST requests to a specific URL path.

// app.get('/',(req,res)=>{
//     res.send("HOME PAGE");
// })

// now instead of the above routs i use "rout prefix" as i created router :
//  code is responsible for including and using the routes defined in a separate module 
// rout prefix: 
app.use("",require("./routes/routes"));
app.use("/submit_rating",require("./routes/routes"));
app.use("/fetch_ratings", require("./routes/routes"));





// start the HTTP server and listen for incoming connections.
app.listen(PORT,()=>{
    console.log(`server started at http://localhost:${PORT}`);
})
