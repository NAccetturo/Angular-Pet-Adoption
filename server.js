
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/lickmahtoesies');
// var CommentSchema = new mongoose.Schema({
//     rating: { type: Number, required: true },
//     text: { type: String, default: "", required: true, },
//     }, {timestamps: true})

// mongoose.model('Comment', CommentSchema);
// let Comment = mongoose.model('Comment')

var PetSchema = new mongoose.Schema({
    name: { type: String, required: [true, "Please input a name."], minlength: 3},
    type: { type: String, required: [true, "Please input a pet type, like snake, or dolphin."], minlength: 3},
    description: {type: String, required: [true, "Please input a description."], minlength: 3},
    skill1: {type: String, default: ""},
    skill2: {type: String, default: ""},
    skill3: {type: String, default: ""},
    }, {timestamps: true})

    // match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']

mongoose.model('Pet', PetSchema);
let Pet = mongoose.model('Pet') // We are retrieving this Schema from our Models, named 'User'

app.use(bodyParser.json());
const path = require('path');
// Setting our Static Folder Directory
app.use(express.static(path.join( __dirname + '/public/dist/public')));
// Setting our Views Folder Directory
// app.set('views', path.join(__dirname, './views'));


// Routes
// Root Request
app.get('/api/', function(req, res) {
    res.json();
})

app.get('/api/pets', function(req, res) {
    Pet.find({}, function(err, pets){
    console.log(pets);
    res.json({pets});
    })
})

app.post('/api/pets', function(req, res) {
    let incomingPet = new Pet({
         name: req.body.name,
         type: req.body.type,
         description: req.body.description,
         skill1: req.body.skill1,
         skill2: req.body.skill2,
         skill3: req.body.skill3,})
    incomingPet.save(function(err, data) {
        if(err) {
            console.log('something went wrong');
        } else { // else console.log that we did well and then redirect to the root route
            console.log('successfully added a user!', incomingPet.name);
        }
        res.json({data});
    })
})

app.put('/api/pets/:id', function(req, res) {
    Pet.findOneAndUpdate({_id: req.params.id},
        {   name: req.body.name,
            type: req.body.type,
            description: req.body.description,
            skill1: req.body.skill1,
            skill2: req.body.skill2,
            skill3: req.body.skill3,}, { runValidators: true },
      function(err, data) {
        if(err) {
            console.log('something went wrong');
        } else { // else console.log that we did well and then redirect to the root route
            console.log('successfully updated a pet!', data.name);
        }
        res.json({data});
    })
})

app.delete('/api/pets/:id', function(req, res) {
    Pet.remove({_id: req.params.id},function(err) {
        if(err) {
            console.log('something went wrong');
        } else { // else console.log that we did well and then redirect to the root route
            console.log('successfully axed a pet!');
        }
        res.json({message: "Success"});
    })
})
app.get('/api/pets/:id', function(req, res) {
    Pet.findOne({_id: req.params.id},function(err,data) {
        if(err) {
            console.log('something went wrong');
        } else { // else console.log that we did well and then redirect to the root route
            console.log('successfully found a pet!', data);
        }
        res.json({data});
    })
})
// app.post('/pets/:id', function(req, res) {
//     console.log("POST DATA", req.body);
//     var comment = new Comment({rating: req.body.rating, text: req.body.text});
//     comment.save(function(err, data) {
//         if(err) {
//             console.log('something went wrong');
//         } else {
//             console.log('successfully added a user!', comment.comment);
//             Pet.findOneAndUpdate({_id: req.params.id}, {$push: {attachedComments: data}}, function(err, Pet){
//                 Pet.save(function(err){
//                     if(err) {
//                     console.log('something went wrong with saving comment');
//                     } else {
//                     console.log('successfully found some stuff', data);
//                     }
//                     res.json({Pet});
//                 })
//             })
//         }
//     })
// })
// this route will be triggered if any of the routes above did not match
app.all("*", (req,res,next) => {
    res.sendFile(path.resolve("./public/dist/public/index.html"))
  });


// Setting our Server to Listen on Port: 8000
app.listen(8000, function() {
    console.log("listening on port 8000");
})