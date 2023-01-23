const express = require("express");
const app = express();
const cors = require('cors');
require('dotenv').config();
const morgan = require("morgan");
const Note = require("./models/note");
const path = require("path");

app.use(express.json());

app.use(cors());

app.use(morgan(function (tokens, request, response) {
    return [
        tokens.method(request, response),
        tokens.url(request, response),
        tokens.status(request, response),
        tokens.res(request, response, 'content-length'), '-',
        tokens['response-time'](request, response), 'ms'
    ].join('  ')
}));

app.use(express.static(path.join(".", "client", "build")));

// route handlers
app.get("/", (request, response) => {
    response.send("<h1>Hello World!</h1>")
});

app.get("/api/notes", (request, response) => {
    Note.find({}).then(notes => {
        response.json(notes);
    });
});

app.get("/api/notes/:id", (request, response) => {
    Note.findById(request.params.id)
    .then(note => {
        if (note) {
                response.json(note);
            } else {
                response.status(404).end();
            };
        })
        .catch(error => next(error))
    });
    
app.delete("/api/notes/:id", (request, response) => {
    Note.findByIdAndRemove(request.params.id)
        .then(result => {
            response.status(204).end();
        })
        .catch(error => next(error));
});

app.post("/api/notes", (request, response, next) => {
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

app.put('/api/notes/:id', (request, response, next) => {
    const body = request.body;
  
    const note = {
      content: body.content,
      important: body.important,
    }
  
    Note.findByIdAndUpdate(request.params.id, note, { new: true })
      .then(updatedNote => {
        response.json(updatedNote)
      })
      .catch(error => next(error))
  })

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
};

app.use(unknownEndpoint);

const errorHandler = (error, request, response, next) => {
    console.error(error.message)
    if (error.name === "CastError") {
        return response.status(400).send({ error: "malformatted id" })
    }
    next(error)
};

app.use(errorHandler);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
});