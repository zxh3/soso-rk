import React, { useState, useEffect } from 'react';
import styles from "./NoteGallary.module.css";
import { connect } from 'react-redux';
import StackGrid from 'react-stack-grid';
import { Menu } from 'semantic-ui-react';
import { useProhibitTags } from '../ProhibitTag';
import NoteCard from './NoteCard';
import { db } from '../../firebase';

const NoteGallary = ({ authUser }) => {
  const [activeMenu, setActiveMenu] = useState('trending');
  const [notes, setNotes] = useState([]);
  const prohibitTags = useProhibitTags(authUser.uid);
  useEffect(() => {
    if (activeMenu === 'trending') {
      const unsubscribe = db.collection('notes')
        .limit(12)
        .onSnapshot((querySnapshot) => {
          const notesData = filterByProhibitTags(querySnapshot.docs, prohibitTags);
          notesData.sort((a, b) => b[1].likes.length - a[1].likes.length);
          setNotes(notesData);
        });
      return unsubscribe;
    } else if (activeMenu === 'following') {
      // TODO
      setNotes([]);
    } else if (activeMenu === 'saved') {
      db.collection('users').doc(authUser.uid)
        .get()
        .then((doc) => doc.data().saved)
        .then((saved) => Promise.all(saved.map((noteId) => db.collection('notes').doc(noteId).get())))
        .then((docs) => {
          const notesData = filterByProhibitTags(docs, prohibitTags)
          setNotes(notesData);
        })
        .catch((error) => console.error(error));
    }
  }, [activeMenu, prohibitTags, authUser]);

  const onClickHandler = (e, { name }) => setActiveMenu(name);

  return (
    <div className={styles.container}>

      {/* Menu */}
      <div className={styles.menu}>
        <Menu pointing secondary>
          <Menu.Item name='trending' active={activeMenu === 'trending'} onClick={onClickHandler} />
          <Menu.Item name='following' active={activeMenu === 'following'} onClick={onClickHandler} />
          <Menu.Item name='saved' active={activeMenu === 'saved'} onClick={onClickHandler} />
        </Menu>
      </div>

      {/* Gallary */}
      <StackGrid
        monitorImagesLoaded={true}
        columnWidth={200}
        gutterWidth={20}
        gutterHeight={20}
        duration={0}
      >
        {notes.map(([noteId, note]) => <NoteCard key={noteId} {...note} noteId={noteId} />)}
      </StackGrid>

    </div>
  );
}

// [start] helper functions
const intersection = (array1, array2) => {
  return array1.filter(value => array2.includes(value));
}

const filterByProhibitTags = (docs, prohibitTags) => {
  return docs.map(doc => [doc.id, doc.data()]).filter(([id, { tags }]) => intersection(tags, prohibitTags).length === 0);
}
// [end] helper functions

const mapStateToProps = (state) => ({
  prohibitTags: state.app.prohibitTags
});

export default connect(mapStateToProps)(NoteGallary);