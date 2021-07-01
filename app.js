const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Campground = require("./models/campground");

mongoose.connect("mongodb://localhost:27017/yelp-camp", { 
useUnifiedTopology: true,
useNewUrlParser: true});
mongoose.set('useCreateIndex', true);

//cehck if db is connected
const db = mongoose.connection;
db.on("error",console.error.bind(console,"connection error:"));
db.once("open",()=>{
    console.log("DB connected");
});


app.set("view engine","ejs");
// app.set('views', path.join(__dirname,'views'))


app.get("/",(req,res)=>{
    res.render("home")
})

app.listen(3000,()=>{
    console.log("Server is listening on Port 3000");
})