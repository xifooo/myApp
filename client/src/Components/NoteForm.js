import { useState } from "react"
import PropTypes from "prop-types"

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

NoteForm.propTypes = {
  createNote: PropTypes.func.isRequired
}

export default NoteForm