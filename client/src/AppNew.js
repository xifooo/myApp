import { useState, useEffect } from "react"
import noteService from "./services/notes"
import loginService from "./services/login"

import Footer from "./Components/Footer"
import Notification from "./Components/Notification"
import Note from "./Components/Note"


const App = () => {
  const [notes, setNotes] = useState([])
  const [newNote, setNewNote] = useState("")
  const [showAll, setShowAll] = useState(true)
  const [errorMessage, setErrorMessage] = useState(null)

  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
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

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({ username, password })
      
      window.localStorage.setItem("loggedNoteappUser", JSON.stringify(user))
      noteService.setToken(user.token)
      setUser(user)
      setUsername("")
      setPassword("")
    } catch (exception) {
      setErrorMessage("Wrong credentials")
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const loginForm = () => (
    <form onSubmit={handleLogin}>
      <div>
        username:
        <input
          type="text"
          value={username}
          name="Username"
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
        password:
        <input
          type="password"
          value={password}
          name="Password"
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <button type="submit"> login </button>
    </form>
  )
  

  const addNote = (event) => {
    event.preventDefault()
    const note = {
      content: newNote,
      date: new Date().toISOString(),
      important: Math.random() > 0.5
    }
    noteService
      .create(note)
      .then(res => {
        setNotes(notes.concat(res))
        setNewNote("")
      })
      .catch(error => {
        setErrorMessage(`Some errors occupying::: ${error}`)
      })
  };

  const handleNoteChange = (event) => {
    setNewNote(event.target.value)
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
    <form onSubmit={addNote}>
      <input value={newNote} onChange={handleNoteChange} />
      <button type="submit"> SAVE </button>
    </form>
  )
  
  return (
    <div>
      <h1>Notes</h1>
      <Notification message={errorMessage} />

      {user === null 
        ? loginForm() 
        : <div>
            <p>{user.name} logged-in</p>
            {notesForm()}
          </div>
      }

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
