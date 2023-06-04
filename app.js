const config = require('./utils/config')
const express = require('express')
require("express-async-errors")
const app = express()
const cors = require('cors')
const loginRouter = require('./controllers/login')
const userRouter = require("./controllers/users")
const notesRouter = require('./controllers/notes')
const middleware = require('./utils/middleware')
const logger = require('./utils/logger')
const mongoose = require('mongoose')
const path = require("path")

logger.info('connecting to', config.MONGODB_URI)

mongoose.connect(config.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
  })
  .then(() => {
    logger.info('connected to MongoDB')
    mongoose.set('strictQuery', false)
  })
  .catch((error) => {
    logger.error('error connecting to MongoDB:', error.message)
  })

// 自上而下地加载 middlewares
app.use(cors())
// app.use(express.static('build'))
// app.use(express.static(path.join(".", "client", "build")));
app.use(express.json())
app.use(middleware.requestLogger)

app.use("/api/login", loginRouter)
app.use("/api/users", userRouter)
app.use('/api/notes', notesRouter)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app