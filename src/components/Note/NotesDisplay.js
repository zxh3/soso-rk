import React from 'react';
import StackGrid from 'react-stack-grid';
import NoteCard from './NoteCard';

const NotesDisplay = ({ notes }) => {
  return (
    <StackGrid
      monitorImagesLoaded={true}
      columnWidth={200}
      gutterWidth={20}
      gutterHeight={20}
      duration={0}
    >
      {notes.map(([noteId, note]) => <NoteCard key={noteId} {...note} noteId={noteId} />)}
    </StackGrid>
  );
}

export default NotesDisplay;