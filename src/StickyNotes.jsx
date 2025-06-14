import React, { useState, useEffect } from "react";

export default function StickyNotes() {
  const [notes, setNotes] = useState(() => {
    const saved = localStorage.getItem("stickyNotes");
    return saved ? JSON.parse(saved) : [""];
  });

  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    localStorage.setItem("stickyNotes", JSON.stringify(notes));
  }, [notes]);

  const addNote = () => setNotes([...notes, ""]);

  const updateNote = (index, text) => {
    const newNotes = [...notes];
    newNotes[index] = text;
    setNotes(newNotes);
  };

  const deleteNote = (index) => {
    setNotes(notes.filter((_, i) => i !== index));
  };

  const filteredNotes = notes.filter((note) =>
    note.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 p-8 flex flex-col items-center">
      <h1 className="text-4xl font-semibold mb-8 text-gray-800">Sticky Notes</h1>

      <div className="flex flex-col sm:flex-row items-center gap-4 w-full max-w-4xl mb-8">
        <input
          type="text"
          placeholder="Search notes..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-grow px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />
        <button
          onClick={addNote}
          className="px-6 py-3 bg-indigo-600 text-white rounded-md shadow hover:bg-indigo-700 transition"
        >
          + Add Note
        </button>
      </div>

      {filteredNotes.length === 0 && (
        <p className="text-gray-500">No notes found.</p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full max-w-6xl">
        {filteredNotes.map((note, i) => (
          <div
            key={i}
            className="bg-white rounded-lg shadow-md p-4 relative flex flex-col"
          >
            <textarea
              value={note}
              onChange={(e) => updateNote(i, e.target.value)}
              className="resize-none w-full h-32 border border-gray-200 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-indigo-400 text-gray-800"
              placeholder="Type your note..."
            />
            <button
              onClick={() => deleteNote(i)}
              aria-label="Delete note"
              className="absolute top-2 right-2 text-gray-400 hover:text-red-600 text-xl font-bold"
            >
              &times;
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
