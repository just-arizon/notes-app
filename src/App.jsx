import { useState, useEffect } from 'react';
import Note from './components/Note'
import axios from 'axios'
import noteService from './services/notes'
import Notification from './components/Notifications'

const App = () => {
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState('a new note...');
  const [showAll, setShowAll] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null)

  const hook = () => {
      noteService
      .getAll()
      .then(initialNotes => {
        setNotes(initialNotes)
      })
  }
  
  useEffect(hook, [])
  
  const addNote = (event) => {
    event.preventDefault()
    const noteObject = {
      content: newNote,
      important: Math.random() < 0.5,
      id: String(notes.length + 1)
    }

    noteService
    .create(noteObject)
    .then(returnedNote => {
      console.log(returnedNote)
       
    setNotes(notes.concat(returnedNote))
    setNewNote('')
    })
 
    console.log('button clicked', event.target); 
  }

  const handleNoteChange = (event) => {
    console.log(event.target.value);
    setNewNote(event.target.value)
  }

  // show important notes
  const notesToShow = showAll ? notes : notes.filter(note => note.important)

// toggleImportance function
const toggleImportanceOf = (id) => {
  const url = `http://localhost:3001/notes/${id}`
  const note = notes.find(n => n.id === id)
  const changedNote = {...note, important: !note.important }
  // console.log(`importance of   ${id}  needs to be toggled`);
  // console.log(note);
  
  noteService
  .update(url, changedNote)
  .then(returnedNote => {
    setNotes(notes.map(n => n.id === id ? returnedNote : n))
  })
  .catch(error => {
    setErrorMessage(
      `the note '${note.content}' was already deleted from server`
    )
    setNotes(notes.filter(n => n.id !== id))

    setTimeout(() => {
      setErrorMessage(null)
    }, 5000)

  })
} 

  return (
    <div>
      <h1>Notes</h1>
      <Notification message={errorMessage} />
      <div>
        <button onClick={() => setShowAll(!showAll)}>
          show {showAll ? 'important' : 'all'}
        </button>
      </div>
      <ul>
        {notesToShow.map(note => 
          <Note 
          key={note.id} 
          note={note} 
          toggleImportance={() => toggleImportanceOf(note.id)}
          />
        )}
      </ul>

      <form onSubmit={addNote}>
        <input type="text" value={newNote} onChange={handleNoteChange}/>
        <button type='submit'>save</button>
      </form>
    </div>
  )
}

export default App