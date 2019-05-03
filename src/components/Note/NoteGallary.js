import React, { useState, useEffect } from 'react';
import styles from "./NoteGallary.module.css";
import { connect } from 'react-redux';
import { Menu } from 'semantic-ui-react';
import { useProhibitTags } from '../ProhibitTag';
import NotesDisplay from './NotesDisplay';
import { db } from '../../firebase';
import _ from 'lodash';

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
      console.log(authUser.uid);
      db.collection('users').doc(authUser.uid)
        .get()
        .then((doc) => doc.data().following)
        .then((followingUserUids) => Promise.all((followingUserUids).map((uid) => {
          return db.collection('users').doc(uid).get()
        })))
        .then((docs) => {
          const followingNoteIds = _.flatten(docs.map((doc) => doc.data().notes));
          return Promise.all(followingNoteIds.map((noteId) => {
            return db.collection('notes').doc(noteId).get()
          }))
        })
        .then((docs) => {
          const notesData = filterByProhibitTags(docs, prohibitTags);
          notesData.sort((a, b) => b[1].date.toDate() - a[1].date.toDate());
          setNotes(notesData);
        })
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
      <Menu pointing secondary className={styles.menu}>
        <Menu.Item 
          name='trending' 
          active={activeMenu === 'trending'} 
          onClick={onClickHandler} 
          style={{ marginLeft: 'auto' }} 
        />
        <Menu.Item 
          name='following' 
          active={activeMenu === 'following'} 
          onClick={onClickHandler} 
        />
        <Menu.Item 
          name='saved' 
          active={activeMenu === 'saved'} 
          onClick={onClickHandler} 
          style={{ marginRight: 'auto' }} 
        />
      </Menu>
      <NotesDisplay notes={notes} />
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