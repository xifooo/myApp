import { useState, useEffect } from "react"
import noteService from "./services/notes"
import loginService from "./services/login"

import Footer from "./Components/Footer"
import Notification from "./Components/Notification"
import Note from "./Components/Note"
import LoginForm from "./Components/LoginForm"


// const LoginForm = ({ userLogin }) => {
//   const [username, setUsername] = useState("")
//   const [password, setPassword] = useState("")

//   const handleLogin = async (event) => {
//     event.preventDefault()
//     userLogin({ username, password })
//     setUsername("")
//     setPassword("")
//   }
//   return (
//     <div>
//       <h2> Login </h2>
//       <form onSubmit={handleLogin}>
//         <div>
//           username:
//           <input
//             type="text"
//             value={username}
//             name="Username"
//             onChange={({ target }) => setUsername(target.value)}
//           />
//         </div>
//         <div>
//           password:
//           <input
//             type="password"
//             value={password}
//             name="Password"
//             onChange={({ target }) => setPassword(target.value)}
//           />
//         </div>
//         <button type="submit"> login </button>
//       </form>
//     </div>
//   )
// }

const NoteForm = ({ createNote }) => {
  const [newNote, setNewNote] = useState("")

  const addNote = e => {
    e.preventDefault()
    createNote({
      content: newNote,
      date: new Date().toISOString(),
      important: Math.random() > 0.5
    })

    setNewNote("")
  }
  return (
    <div>
      <h2>Create a new note</h2>
      <form onSubmit={addNote}>
        <input
          value={newNote}
          onChange={({ e }) => { setNewNote(e.target.value) }}
        />
        <button type="submit"> save </button>
      </form>
    </div>
  )
}

const Togglable = (props) => {
  const [visible, setVisible] = useState(false)

  const hideWhenVisible = { display: visible ? 'none' : '' }
  const showWhenVisible = { display: visible ? '' : 'none' }

  const toggleVisibility = () => {
    setVisible(!visible)
  }
  return (
    <div>
      <div style={hideWhenVisible}>
        <button onClick={toggleVisibility}>{props.buttonLabel}</button>
      </div>
      <div style={showWhenVisible}>
        {props.children}
        <button onClick={toggleVisibility}> cancel </button>
      </div>
    </div>
  )
}


const App = () => {
  const [notes, setNotes] = useState([])
  // const [newNote, setNewNote] = useState("")
  const [showAll, setShowAll] = useState(true)
  const [errorMessage, setErrorMessage] = useState(null)

  // const [username, setUsername] = useState("")
  // const [password, setPassword] = useState("")
  const [user, setUser] = useState(null)


  useEffect(() => {
    noteService
      .getAll()
      .then(res => {
        setNotes(res)
      })
  }, []);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedNoteappUser")
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      noteService.setToken(user.token)
    }
  }, [])

  const handleUserLogin = (userNameAndPasswd) => {
    try {
      const user = loginService.login({ userNameAndPasswd })

      window.localStorage.setItem("loggedNoteappUser", JSON.stringify(user))
      noteService.setToken(user.token)
      setUser(user)
    } catch (exception) {
      setErrorMessage("Wrong credentials")
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const loginForm = () => (
    <Togglable buttonLabel="Login">
      <LoginForm userLogin={handleUserLogin} />
    </Togglable>
  )


  const addNote = (noteObj) => {
    noteService
      .create(noteObj)
      .then(res => {
        setNotes(notes.concat(res))
      })
      .catch(error => {
        setErrorMessage(`Some errors occupying::: ${error}`)
      })
  };

  const toggleImportanceOf = id => {
    const note = notes.find(item => item.id === id)
    const changedNote = { ...note, important: !note.important }
    noteService
      .update(id, changedNote)
      .then(res => {
        setNotes(notes.map(n => n.id !== id ? n : res))
      })
      .catch(error => {
        setErrorMessage(`Note '${note.content}' was already removed from server`)
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)
        setNotes(notes.filter(n => n.id !== id))
      })
  }

  const notesForm = () => (
    <div>
      <p>{user.name} logged-in</p>
      <Togglable buttonLabel="add a new note">
        <NoteForm createNote={addNote} />
      </Togglable>
    </div>
  )

  return (
    <div>
      <h1>Notes</h1>
      <Notification message={errorMessage} />

      {!user && { loginForm }}
      {user && { notesForm }}

      <br />
      <div>
        <button onClick={() => setShowAll(!showAll)}>
          show {showAll ? "important" : "all"}
        </button>
      </div>

      <Note
        notes={notes}
        showAll={showAll}
        toggleImportanceOf={toggleImportanceOf}
      />

      <Footer />
    </div>
  )
}

export default App
