import { useState, useEffect } from 'react';
import Note from './components/Note'
import axios from 'axios'
import { response } from 'express';

const App = () => {
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState('a new note...');
  const [showAll, setShowAll] = useState(true);

  const hook = () => {
    console.log('effect')
    axios
      .get('http://localhost:3001/notes')
      .then(response => {
        console.log('promise fulfilled')
        setNotes(response.data)
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

    axios
    .post('http://localhost:3001/notes', noteObject)
    .then(response => {
      console.log(response)
       
    setNotes(notes.concat(response.data))
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
  
  axios.put(url, changedNote)
  .then(response => {
    setNotes(notes.map(n => n.id === id ? response.data : n))
  })
} 

  return (
    <div>
      <h1>Notes</h1>
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