// const bcrypt = require('bcrypt')
const initialUsers = [
  {
    username: "mlonokai",
    name: "jaks",
    password: "123123"
  },
  {
    username: "hellter",
    name: "jyeho",
    password: "141414"
  }
]

const initialNotes = [
  {
    "content": "Under pressure",
    "important": true,
    "user": 123123
  },
  {
    "content": "breakdown",
    "important": true,
    "user": 141414
  },
  {
    "content": "Good times, bad times",
    "important": true,
    "user": 123123
  },
  {
    "content": "God save queen",
    "important": true,
    "user": 123123
  }
]

module.exports = {
  initialUsers, initialNotes
}


// async function initUsers () {
//     const newdata = initialUsers.map(async (u) => {
//         const hashedId = await bcrypt.hash(u.password, 10)
//         return {
//           username: u.username,
//           name: u.name,
//           password: hashedId
//         }
//       })

//       Promise.all(newdata)
//         .then(async (result) => {
//           const availibleData = result.map(
//             ({username, name, password}) =>
//             ({username, name, passwordHash: password})
//           )
//           console.log(availibleData)
//         //   await User.insertMany(availibleData)
//         //   const usersInDb = await User.find({})
//         //   res.status(200).json(usersInDb)
//         })
// }

// initUsers()

