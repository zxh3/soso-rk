import { useState, useEffect } from 'react';
import { db } from '../../firebase';

const useNoteData = (noteId) => {
  const [noteData, setNoteData] = useState(null);
  useEffect(() => {
    const unsubscribe = db.collection('notes').doc(noteId)
    .onSnapshot((doc) => {
      if (doc.exists)
        setNoteData(doc.data());
      else
        setNoteData('!exists');
    });
    return unsubscribe;
  }, [noteId]);
  return noteData;
}

export default useNoteData;