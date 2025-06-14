import { useState, useEffect } from 'react';

export default function App() {
  const [notes, setNotes] = useState(() => {
    const saved = localStorage.getItem('notes');
    return saved ? JSON.parse(saved) : [];
  });

  const [title, setTitle] = useState('');
  const [text, setText] = useState('');
  const [search, setSearch] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editText, setEditText] = useState('');

  useEffect(() => {
    localStorage.setItem('notes', JSON.stringify(notes));
  }, [notes]);

  const addNote = () => {
    if (!title.trim() && !text.trim()) return;

    const newNote = {
      id: Date.now(),
      title: title.trim() || '',
      text: text.trim() || '',
    };

    setNotes([newNote, ...notes]);
    setTitle('');
    setText('');
  };

  const startEditing = (note) => {
    setEditingId(note.id);
    setEditTitle(note.title);
    setEditText(note.text);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditTitle('');
    setEditText('');
  };

  const saveEditing = (id) => {
    setNotes(notes.map(note =>
      note.id === id ? { ...note, title: editTitle.trim(), text: editText.trim() } : note
    ));
    cancelEditing();
  };

  const deleteNote = (id) => {
    if (window.confirm('Delete this note?')) {
      setNotes(notes.filter(note => note.id !== id));
      if (editingId === id) cancelEditing();
    }
  };

  const filteredNotes = notes.filter(note => {
    const titleMatch = (note.title || '').toLowerCase().includes(search.toLowerCase());
    const textMatch = (note.text || '').toLowerCase().includes(search.toLowerCase());
    return titleMatch || textMatch;
  });

  return (
    <div className="min-h-screen bg-gray-100 p-6 flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-6">Sticky Notes</h1>

      {/* Search bar */}
      <input
        type="text"
        placeholder="Search notes..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        className="mb-4 px-4 py-2 border rounded w-full max-w-md"
      />

      {/* New note inputs */}
      <div className="flex flex-col mb-6 max-w-md w-full space-y-2">
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={e => setTitle(e.target.value)}
          className="px-4 py-2 border rounded"
        />
        <textarea
          placeholder="Note text"
          value={text}
          onChange={e => setText(e.target.value)}
          className="px-4 py-2 border rounded resize-none"
          rows={3}
          onKeyDown={e => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              addNote();
            }
          }}
        />
        <button
          onClick={addNote}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Add Note
        </button>
      </div>

      {/* Notes grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 max-w-4xl w-full">
        {filteredNotes.length === 0 ? (
          <p className="text-gray-500 col-span-full text-center">No notes found.</p>
        ) : (
          filteredNotes.map(note => (
            <div
              key={note.id}
              className="bg-yellow-200 p-4 rounded shadow break-words relative"
            >
              {editingId === note.id ? (
                <>
                  <input
                    type="text"
                    value={editTitle}
                    onChange={e => setEditTitle(e.target.value)}
                    className="w-full mb-2 px-2 py-1 border rounded"
                    placeholder="Title"
                  />
                  <textarea
                    value={editText}
                    onChange={e => setEditText(e.target.value)}
                    className="w-full mb-2 px-2 py-1 border rounded resize-none"
                    rows={3}
                    placeholder="Note text"
                  />
                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={() => saveEditing(note.id)}
                      className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 transition"
                    >
                      Save
                    </button>
                    <button
                      onClick={cancelEditing}
                      className="bg-gray-400 text-white px-3 py-1 rounded hover:bg-gray-500 transition"
                    >
                      Cancel
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <h3 className="font-bold mb-2">{note.title || 'Untitled'}</h3>
                  <p>{note.text}</p>
                  <div className="absolute top-2 right-2 flex space-x-2">
                    <button
                      onClick={() => startEditing(note)}
                      className="bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700 transition"
                      aria-label="Edit note"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteNote(note.id)}
                      className="bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700 transition"
                      aria-label="Delete note"
                    >
                      Delete
                    </button>
                  </div>
                </>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
