const express = require("express"); // Importing express module
const path = require("path"); //module to join the path of pug file to express app
const bodyparser = require('body-parser');
const mongoose = require('mongoose'); //database connection

main().catch(err => console.log(err));
async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/accident_details',{
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }).then(() => console.log("Connected to Mongo Successfully"));
}

const app = express(); // Intializing express app
const port = 3000 // setting port to default as 3000

app.use(bodyparser.urlencoded({ extended: true }));
app.use(bodyparser.json());

// Defining mongoose schema
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email:{
        type:String,
        required:true
    },
    phoneNumber:{
        type:Number,
        required:true
    },
    emergencyContactName:{
        type:String,
        required:true
    },
    emergencyContactPhoneNumber:{
        type:Number,
        required:true
    }
});
const mymodel = mongoose.model('mymodel', userSchema);
// Express configuration
app.use('/static',express.static('static')); // For serving static files
app.use(express.urlencoded()); //middleware to config html file in express
// or

// Pug configuration
app.set('view engine','pug'); //setting template engine as pug
app.set('public',path.join(__dirname,'public')) //setting the public directory

//Endpoints
app.get('/',(req,res)=>{
    res.status(200).render('account.pug');
})

app.post('/alertpage',async (req,res)=>{
    var Data = new mymodel(req.body);
    Data.save().then(()=>{
        // res.status(200).send("Data saved!!");
        res.status(200).render('mainpage.pug');
    }).catch((err)=>{
        res.status(400).send({error:`server error ${err.mesage}`}); // Send JSON response
    })
})
// listen to server // starting server
app.listen(port,()=>{
    console.log(`The application started successfully on port ${port}`);
})