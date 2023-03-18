const notesRouter = require('express').Router()
const Note = require('../models/note')


// notesRouter.get("/", (request, response, next) => {
//     Note.find({}).then(notes => {
//           response.json(notes);
//   });
// });

// notesRouter.get('/:id', async (request, response, next) => {
//   try {
//     const note = await Note.findById(request.params.id)
//     if (note) {
//         response.json(note)
//       } else {
//       response.status(404).end()
//     }
//   } catch(exception) {
//     next(exception)
//     }
// })
  
notesRouter.get('/', async (request, response) => {
  const notes = await Note.find({})
  response.json(notes)
})

notesRouter.get('/:id', async (request, response) => {
  const note = await Note.findById(request.params.id)
  if (note) {
    response.json(note)
  } else {
    response.status(404).end()
  }
})

notesRouter.delete('/:id', async (request, response) => {
  // 不再使用next(exception)，因为使用了express-async-erros库
  // try {
  //   await Note.findByIdAndRemove(request.params.id)
  //   response.status(204).end()
  // } catch (exception) {
  //   next(exception)
  // }
    await Note.findByIdAndRemove(request.params.id)
    response.status(204).end()
})

notesRouter.post('/', async (request, response) => {
  const body = request.body

  const note = new Note({
    content: body.content,
    important: body.important || false,
    date: new Date(),
  })

  const savedNote = await note.save()
  response.json(savedNote)
})


// notesRouter.post("/", (request, response, next) => {
//   const body = request.body;
  
//   if (body.content === undefined) {
//       return response.status(400).json({  // 400 Bad request
//           error: "content missing"
//       })
//   };
//   const note = new Note({
//       content: body.content,
//       important: body.important || false,
//       date: new Date()
//   });
  
//   note.save().then(savedNote => {
//       response.status(201).json(savedNote);
//   })
//   .catch(error => next(error));
// });

notesRouter.put('/:id', async (request, response) => {
  const { content, important } = request.body;

  const updatedNote = await Note.findByIdAndUpdate(
    request.params.id, 
    { content, important }, 
    { new: true, runValidators: true, context: "query" }
    )
  response.json(updatedNote)
})

module.exports = notesRouter