const usersRouter = require("express").Router()
const User = require("../models/user")
const bcrypt = require("bcrypt")
const init_db = require("../utils/init_db")


usersRouter.get("/", async (req, res) => {
  const users = await User.find({}).populate("notes", { "content": 1, "date": 1 })
  res.status(200).json(users)
})


usersRouter.get("/:id", async (req, res) => {
  const users = await User.findById({ "id": req.params.id })
  res.status(200).json(users)
})


usersRouter.post("/", async (req, res) => {
  const { username, name, password } = req.body

  const existingUser = await User.findOne({ username })
  if (existingUser) {
    return res.status(400).json({
      error: "username must be unique"
    })
  }

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

  const user = new User({
    username,
    name,
    passwordHash,
  })

  const savedUser = await user.save()

  res.status(201).json(savedUser)
})


usersRouter.post("/init-users/2", async (req, res) => {
  // await User.deleteMany({})
  // var initedUser = []
  // for (let u of init_db.initialUsers) {
  //   const existingUser = await User.findOne({ username: u.username })
  //   if (existingUser) {
  //     return res.status(400).json({
  //       error: 'username must be unique'
  //     })
  //   }

  //   const passwordHash = await bcrypt.hash(u.password, 10)
  //   const user = new User({
  //     username: u.username,
  //     name: u.name,
  //     passwordHash: passwordHash
  //   })
  //   const savedUser = await user.save()
  //   initedUser = initedUser.concat(savedUser)
  // }

  // res.status(201).json(initedUser)

  async function initUsers(initialUsers) {
    await User.deleteMany({})

    const newdata = await initialUsers.map(async (u) => {
      const hashedId = await bcrypt.hash(u.password, 10)
      return {
        username: u.username,
        name: u.name,
        password: hashedId
      }
    })

    Promise.all(newdata)
      .then(async (result) => {
        const availibleData = result.map(
          ({ username, name, password }) =>
            ({ username, name, passwordHash: password })
        )
        // console.log(availibleData)
        await User.insertMany(availibleData)
        const usersInDb = await User.find({})
        res.status(201).json(usersInDb)
      })
  }

  initUsers(init_db.initialUsers)
})


module.exports = usersRouter