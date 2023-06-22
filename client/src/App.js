import { useState, useEffect, useRef } from "react"
import noteService from "./services/notes"
import loginService from "./services/login"

import Footer from "./Components/Footer.js"
import Togglable from "./Components/Togglabble.js"
import LoginForm from "./Components/LoginForm.js"
import Notification from "./Components/Notification.js"
import Note from "./Components/Note.js"
import NoteForm from "./Components/NoteForm.js"


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
      noteService.setToken(user.token)
      setUser(user)
    }
  }, [])

  const handleUserLogin = async (userNameAndPasswd) => {
    try {
      const user = await loginService.login(userNameAndPasswd)
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

  const handleLogout = () => {
    try {
      window.localStorage.removeItem("loggedNoteappUser")
      setNotes([])
      setUser(null)
      noteService.setToken(null)

      setTimeout(() => {
        window.location.href = "/"
      }, 5000)
    } catch (exception) {
      setErrorMessage("Logout failed")
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const noteFormRef = useRef()

  const addNote = async (noteObj) => {
    try {
      const theNote = {
        ...noteObj,
        user: user.id
      }
      const returnedNotes = await noteService.create(theNote)
      await setNotes(notes.concat(returnedNotes))
      await noteFormRef.current.toggleVisibility()
    } catch (exception) {
      setErrorMessage(`Some errors occupying???::: ${exception}`)
    }
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
          <LoginForm handleUserLogin={handleUserLogin} />
        </Togglable>
      }
      {user &&
        <div>
          <p>
            {user.username} logged-in
            <button onClick={handleLogout}> Logout </button>
          </p>
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
          note={noteObj}
          toggleImportance={() => toggleImportanceOf(noteObj.id)}
        />
      )}

      <Footer />
    </div>
  )
}

export default App
