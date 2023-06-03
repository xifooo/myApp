const notesRouter = require('express').Router()
const Note = require('../models/note')
const User = require('../models/user')
const init_db = require("../utils/init_db")
const jwt = require("jsonwebtoken")

// notesRouter.get("/", (req, res, next) => {
//     Note.find({}).then(notes => {
//           res.json(notes);
//   });
// });

// notesRouter.get('/:id', async (req, res, next) => {
//   try {
//     const note = await Note.findById(req.params.id)
//     if (note) {
//         res.json(note)
//       } else {
//       res.status(404).end()
//     }
//   } catch(exception) {
//     next(exception)
//     }
// })

notesRouter.get('/', async (req, res) => {
  const notes = await Note.find({})
  res.json(notes)
})


notesRouter.get('/:id', async (req, res) => {
  const note = await Note.findById(req.params.id)
  if (note) {
    res.json(note)
  } else {
    res.status(404).end()
  }
})


notesRouter.delete('/:id', async (req, res) => {
  // 不再使用next(exception)，因为使用了express-async-erros库
  // try {
  //   await Note.findByIdAndRemove(req.params.id)
  //   res.status(204).end()
  // } catch (exception) {
  //   next(exception)
  // }
  await Note.findByIdAndRemove(req.params.id)
  res.status(204).end()
})

const getTokenFrom = request => {
  const authorization = request.get("authorization")
  if (authorization && authorization.toLowerCase().startsWith("bearer ")) {
    return authorization.substring(7)
  }
  return null
}

notesRouter.post('/', async (req, res) => {
  const body = req.body
  const token = getTokenFrom(req)
  const decodeToken = jwt.verify(token, process.env.SECRET)
  if (!decodeToken.id) {
    return res.status(401).json({ error: "token missing or invalid" })
  }

  const user = await User.findById(decodeToken.id)

  const note = new Note({
    content: body.content,
    important: body.important || false,
    date: new Date(),
    user: user._id
  })

  const savedNote = await note.save()
  user.notes = user.notes.concat(savedNote._id)
  await user.save()

  res.status(201).json(savedNote)
})


// notesRouter.post("/", (req, res, next) => {
//   const body = req.body;

//   if (body.content === undefined) {
//       return res.status(400).json({  // 400 Bad req
//           error: "content missing"
//       })
//   };
//   const note = new Note({
//       content: body.content,
//       important: body.important || false,
//       date: new Date()
//   });

//   note.save().then(savedNote => {
//       res.status(201).json(savedNote);
//   })
//   .catch(error => next(error));
// });


notesRouter.put('/:id', async (req, res) => {
  const { content, important } = req.body;

  const updatedNote = await Note.findByIdAndUpdate(
    req.params.id,
    { content, important },
    { new: true, runValidators: true, context: "query" }
  )
  res.json(updatedNote)
})


notesRouter.get("/init-notes/2", async (req, res) => {
  await Note.deleteMany({})
  const allUsers = await User.find({})
  for (let i = 0; i < init_db.initialNotes.length; i++) {
    const rdN = Math.floor(Math.random() * (allUsers.length))
    const noteData = init_db.initialNotes[i]
    const newNote = new Note({
      content: noteData.content,
      date: noteData.date || new Date(),
      important: noteData.important || false,
      user: allUsers[rdN]._id
    })
    const savedNote = await newNote.save()
    const user = await User.findById(allUsers[rdN].id)
    user.notes.push(savedNote._id)
  }
  const allNotes = await Note.find({})
  return res.status(201).json(allNotes)
})

module.exports = notesRouter