import { useState, useEffect, useRef } from "react"
import noteService from "./services/notes"
import loginService from "./services/login"

import Footer from "./Components/Footer"
import Notification from "./Components/Notification"
import Note from "./Components/Note"
import LoginForm from "./Components/LoginForm"
import Togglable from "./Components/Togglabble"


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
          onChange={({ target }) => { setNewNote(target.value) }}
        />
        <button type="submit"> save </button>
      </form>
    </div>
  )
}


const App = () => {
  const [notes, setNotes] = useState([])

  const [showAll, setShowAll] = useState(true)
  const [errorMessage, setErrorMessage] = useState(null)

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
      const user = loginService.login(userNameAndPasswd)

      window.localStorage.setItem("loggedNoteappUser", JSON.stringify(user))
      noteService.setToken(user.token)
      setUser(user)
    } catch (exception) {
      setErrorMessage("Wrong credentials")
      setTimeout(() => {
        setErrorMessage(null)
        noteService.setToken(null)
        setUser(null)
      }, 5000)
    }
  }

  // const loginForm = () => (
  //   <div>
  //     <Togglable buttonLabel="Login">
  //       <LoginForm handleuserLogin={handleUserLogin} />
  //     </Togglable>
  //   </div>
  // )

  const noteFormRef = useRef()

  const addNote = (noteObj) => {
    noteFormRef.current.toggleVisibility()
    noteService
      .create(noteObj)
      .then(returnedNotes => {
        setNotes(notes.concat(returnedNotes))
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

  // const notesForm = () => (
  //   <div>
  //     <p>{user.name} logged-in</p>
  //     <Togglable buttonLabel="add a new note" ref={noteFormRef}>
  //       <NoteForm createNote={addNote} />
  //     </Togglable>
  //   </div>
  // )

  return (
    <div>
      <h1>Notes</h1>
      <Notification message={errorMessage} />

      {!user && 
        <Togglable buttonLabel="Login">
          <LoginForm handleuserLogin={handleUserLogin} />
        </Togglable>
      }
      {user && 
        <div>
          <p>{user.username} logged-in</p>
          <Togglable buttonLabel="add a new note" ref={noteFormRef}>
            <NoteForm createNote={addNote} />
          </Togglable>
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
