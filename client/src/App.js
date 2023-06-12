import { useState, useEffect, useRef } from "react"
import noteService from "./services/notes"
import loginService from "./services/login"

import Footer from "./Components/Footer"
import Notification from "./Components/Notification"
import Note from "./Components/Note"
import NoteForm from "./Components/NoteForm"
import LoginForm from "./Components/LoginForm"
import Togglable from "./Components/Togglabble"


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
  }, [])

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

  const noteFormRef = useRef()

  const addNote = (noteObj) => {
    noteService
      .create(noteObj)
      .then(returnedNotes => {
        setNotes(notes.concat(returnedNotes))
        noteFormRef.current.toggleVisibility()
      })
      .catch(error => {
        setErrorMessage(`Some errors occupying::: ${error}`)
      })
  }

  const notesToShow = showAll
    ? notes
    : notes.filter(note => note.important)

  const toggleImportanceOf = id => {
    const note = notes.find(item => item.id === id)
    const changedNote = { ...note, important: !note.important }
    noteService
      .update(id, changedNote)
      .then(res => {
        setNotes(notes.map(n => n.id !== id ? n : res))
      })
      .catch(error => {
        setErrorMessage(`Wrong things occupying:::${error}`)
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)
        setNotes(notes.filter(n => n.id !== id))
      })
  }
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

      {notesToShow.map(noteObj =>
        <Note
          key={noteObj.id}
          notes={noteObj}
          toggleImportance={() => toggleImportanceOf(noteObj.id)}
        />
      )}

      <Footer />
    </div>
  )
}

export default App
