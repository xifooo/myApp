import { useState, useEffect } from "react"
import noteService from "./services/notes"

const Footer = () => {
  const footerStyle = {
    color: 'green',
    fontStyle: 'italic',
    fontSize: 16
  }
  return (
    <div style={footerStyle}>
      <br />
      <em> Note app, Department of Computer Science, University of Helsinki 2022 </em>
    </div>
  )
}

const Notification = ({ message }) => {
  if (message === null) {
    return null
  }
  return (
    <div className='error'>
      {message}
    </div>
  )
};

const Note = ({ note, toggleImportance }) => {
  const label = note.important ? 'make not important' : 'make important'
  return (
    <li>
      {note.content}    
      <button onClick={toggleImportance}> {label} </button>
    </li>
    )
};

const App = () => {
  const [notes, setNotes] = useState([])
  const [newNote, setNewNote] = useState('') 
  const [showAll, setShowAll] = useState(true)
  const [errorMessage, setErrorMessage] = useState('some error happened...')

  useEffect(() => {
    noteService
      .getAll()
      .then(response => {
        setNotes(response.data)
      })  
    }, []);
  
  const toggleImportanceOf = id => {
    const note = notes.find(n => n.id === id)
    const changedNote = { ...note, important: !note.important }

    noteService
      .update(id, changedNote)
      .then(response => {
        setNotes(notes.map(note => note.id !== id ? note : response.data))      
      })
      .catch(error => {
        setErrorMessage(
          `Note '${note.content}' was already removed from server`
        );
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000);
        setNotes(notes.filter(n => n.id !== id));
      })
    };

  const addNote = (event) => {
    event.preventDefault();
    const noteObject = {
      content: newNote,
      date: new Date().toISOString(),
      important: Math.random() > 0.5
    };

    noteService
      .create(noteObject)
      .then(response => {
        setNotes(notes.concat(response.data));
        setNewNote('');
        })
      .catch(error => {
        setErrorMessage(
          `The form of Note is not right: ${error}`)
        })
    };
    // filtered notes
    const notesToShow = showAll
      ? notes
      : notes.filter(note => note.important === true)
  
    // input's onChange event handler
    const handleNoteChange = (event) => {
      console.log(event.target.value)
      setNewNote(event.target.value)
    };
  return (
    <div>
      <h1>Notes</h1>
      <Notification message={errorMessage} />

      <div>
        <button onClick={() => setShowAll(!showAll)}>
          show {showAll ? 'important' : 'all' }
        </button>
      </div>

      <ul>
        {notesToShow.map( note => 
          <Note
            key={note.id}
            note={note}
            toggleImportance={() => toggleImportanceOf(note.id)}
            />
        )}
      </ul>

      <form onSubmit={addNote}>
        <input
          value={newNote}
          onChange={handleNoteChange}
        />
        <button type="submit">save</button>
      </form>

      <Footer />
    </div>
  )
};

export default App