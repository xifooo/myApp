const mongoose = require("mongoose");

if (process.argv.length < 3) {
    console.log('Please provide the password as an argument: node mongo.js <password>');
    process.exit(1);
};

const password = process.argv[2];
const url = `mongodb+srv://jyeho:${password}@cluster0.30kp0cf.mongodb.net/noteApp?retryWrites=true&w=majority`;
mongoose.connect(url);

const noteScehma = new mongoose.Schema({
    content: String,
    date: Date,
    important: Boolean,
});
const Note = mongoose.model("Note", noteScehma);

// const note = new Note({
//     content: "HTML is Easyyyy",
//     date: new Date(),
//     important: true,
// });

// note.save().then(result => {
//     console.log('note saved!');
//     mongoose.connection.close();
// });

let notes = [
    {
        content: "HTML is easyyyyyyyy",
        date: "2022-05-30T17:30:31.098Z",
        important: true
    },
    {
        content: "Browser can execute only Javascript",
        date: "2022-05-30T18:39:34.091Z",
        important: false
    },
    {
        content: "GET and POST are the most important methods of HTTP protocol",
        date: "2022-05-30T19:20:14.298Z",
        important: true
    }
];
Note.insertMany(notes, function(err) { });

Note.find({}).then(result => {
    result.forEach(note => {
      console.log(note)
    })
    mongoose.connection.close()
  });