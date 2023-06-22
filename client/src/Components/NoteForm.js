import { useState } from "react"
import PropTypes from "prop-types"

const NoteForm = ({ createNote }) => {
  const [newNote, setNewNote] = useState("")

  const addNote = e => {
    try {
      e.preventDefault()
      console.log(newNote)
      createNote({
        content: newNote || "nothing fiil",
        // date: new Date().toISOString(),
        // important: Math.random() > 0.5
        important: false
      })

      setNewNote("")
    } catch (exception) {
      window.alert(`Wrong happen : ${exception} !!!`)
    }
  }

  const handleNoteChange = e => {
    setNewNote(e.target.value)
    console.log(newNote)
  }
  return (
    <form onSubmit={addNote}>
      <h2>Create a new note</h2>
      <input
        value={newNote}
        onChange={handleNoteChange}
      />
      <button type="submit"> save </button>
    </form>

  )
}

NoteForm.propTypes = {
  createNote: PropTypes.func.isRequired
}

export default NoteForm