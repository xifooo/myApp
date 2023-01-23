require('dotenv').config();
const express = require("express");
const cors = require('cors');
const morgan = require("morgan");
const path = require("path")
const Note = require("./models/note")

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, "client", "build")));

app.use(cors());
// app.use(morgan("tiny"));
app.use(morgan(function (tokens, request, response) {
    return [
        tokens.method(request, response),
        tokens.url(request, response),
        tokens.status(request, response),
        tokens.res(request, response, 'content-length'), '-',
        tokens['response-time'](request, response), 'ms'
    ].join('  ')
}));


app.get("/", (request, response) => {
    response.send("<h1>Hello World!</h1>")
});

app.get("/api/notes", (request, response) => {
    Note.find({}).then(notes => {
        response.json(notes);
    });
});

app.get("/api/notes/:id", (request, response) => {
    const id = Number(request.params.id);
    Note.findOne({"id":id}).then(note => {
        response.json(note);
    });
});

app.delete("/api/notes/:id", (request, response) => {
    const id = Number(request.params.id);
    Note.deleteOne({"id":id}).then(result => {
        response.status(204).end();
    });
    // notes = notes.filter(note => note.id !== id);
    // response.status(204).end();
});

app.post("/api/notes", (request, response) => {
    const body = request.body;

    if (body.content === undefined) {
        return response.status(400).json({  // 400 Bad request
            error: "content missing"
        })
    };
    const note = new Note({
        content: body.content,
        important: body.important || false,
        date: new Date()
    });

    note.save().then(result => {
        response.json(note);
    });
});

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
};
app.use(unknownEndpoint);

const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
});

