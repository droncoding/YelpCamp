const mongoose = require("mongoose");
const Campground = require("../models/campground");
const cities = require("./cities");
const {descriptors, places} =  require("./seedHelpers");

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

const sample = array => array[Math.floor(Math.random()*array.length)];

const seedDB = async()=>{
    await Campground.deleteMany({});
    for (i=0; i<300;i++){
        const random1000 = Math.floor(Math.random()*1000);
        const price = Math.floor(Math.random()*20);
        const camp = new Campground({
            author:'610a92d094f416367c362d31',
            location:`${cities[random1000].city},${cities[random1000].state}`,
            title:`${sample(descriptors)} ${sample(places)}`,
            image:'https://source.unsplash.com/collection/483251',
            description:"sjadajda",
            price,
            geometry:{
              type: "Point",
              coordinates:[
                cities[random1000].longitude,
                cities[random1000].latitude
              ]
            },
            images:[
                {
                  url: 'https://res.cloudinary.com/dtem2v87n/image/upload/v1628908676/YelpCamp/ab2mame5osdkogew0ift.jpg',
                  filename: 'YelpCamp/ab2mame5osdkogew0ift'
                },
                {
                  url: 'https://res.cloudinary.com/dtem2v87n/image/upload/v1628908676/YelpCamp/t3chvwpkcz2tu9s2jzzr.jpg',
                  filename: 'YelpCamp/t3chvwpkcz2tu9s2jzzr'
                }
              ],

        })

        await camp.save();
    }
    
}

seedDB();