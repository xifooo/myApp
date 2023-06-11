import PropTypes from "prop-types"

const Note = ({ notes, showAll, toggleImportanceOf }) => {
  const notesToShow = showAll
    ? notes
    : notes.filter(item => item.important === true)

  return (
    <ul>
      {notesToShow.map(item =>
        <li key={item.id}>

          {item.content}

          <button onClick={() => toggleImportanceOf(item.id)}>
            {item.important ? "make not important" : "make important"}
          </button>

        </li>
      )}
    </ul>
  )
}

Note.prototype = {
  notes: PropTypes.array.isRequired,
  showAll: PropTypes.bool.isRequired,
  toggleImportanceOf: PropTypes.func.isRequired
}

export default Note