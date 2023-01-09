let phonebook = [
    {
      "id": 1,
      "name": "Arto Hellas",
      "number": "040-123456"
    },
    {
      "id": 2,
      "name": "Ada Lovelace",
      "number": "39-44-5323523"
    },
    {
      "id": 3,
      "name": "Dan Abramov",
      "number": "12-43-234345"
    },
    {
      "id": 4,
      "name": "Mary Poppendieck",
      "number": "39-23-6423122"
    }
];

const express = require("express");
const app = express();

var morgan = require("morgan");

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

app.use(express.json());

app.get("/", (request, response) => {
    response.send("<h1>Hello World!</h1>");
});

app.get("/api/persons", (request, response) => {
    response.json(phonebook);
});

app.get("/info", (request, response) => {
    const num = phonebook.length;
    const date = new Date();

    response.send(`<p>Phonebook has info for ${num}</p> <p>${date}</p>`);
});

app.get("/api/persons/:id", (request, response) => {
    const id = Number(request.params.id);
    const person = phonebook.find(person => person.id === id);

    if (person) {
        response.json(person);
    } else {
        response.status(404).end();
    };
});

app.delete("/api/persons/:id", (request, response) => {
    const id = Number(request.params.id);
    phonebook = phonebook.filter(person => person.id !== id);

    response.status(204).end();
});

const generateId = () => {
    const inner = () => {
        var idArray = [];
        for (let i = 0; i < 9; i ++) {
            idArray = idArray.concat(Math.floor(Math.random() * 10));
        };
        return Number(idArray.join(""))
    };

    const id = phonebook.length > 0
    ? inner()
    : 0

    return id
};

app.post("/api/persons", (request, response) => {
    const body = request.body;

    if (!body) {
        return response.status(400).json({error: "content missing"})
    } else if (!(body.name && body.number)) {
        return response.status(400).json({error: "name or number missing"})
    } else if (phonebook.filter(item => item.name.toUpperCase().indexOf(body.name.toUpperCase()) !== -1).length) {
        return response.status(400).json({ error: "name must be unique"})
    };

    const person = {
        id: generateId(),
        name: body.name,
        number: body.number,
    };

    phonebook = phonebook.concat(person);

    response.json(person);
});

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
};

app.use(unknownEndpoint);

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
});