import React, { useState, useEffect } from 'react';
import StackGrid from 'react-stack-grid';
import { connect } from 'react-redux';
import styles from "./NoteGallary.module.css";
import { Menu } from 'semantic-ui-react';
import NoteCard from './NoteCard';
import { db } from '../../firebase';

const NoteGallary = ({ prohibitTags }) => {
  const [activeMenu, setActiveMenu] = useState('latest');
  const [notes, setNotes] = useState([]);
  useEffect(() => {
    if (activeMenu === 'latest') {
      const unsubscribe = db.collection('notes')
        .orderBy('date', 'desc')
        .limit(12)
        .onSnapshot((querySnapshot) => {
          setNotes(filterByProhibitTags(querySnapshot, prohibitTags));
        });
      return unsubscribe;
    } else if (activeMenu === 'following') {
      setNotes([]);
    } else if (activeMenu === 'saved') {
      setNotes([]);
    }
  }, [activeMenu, prohibitTags]);

  const onClickHandler = (e, { name }) => setActiveMenu(name);

  return (
    <div className={styles.container}>
      <div>
        <Menu pointing secondary>
          <Menu.Item name='latest' active={activeMenu === 'latest'} onClick={onClickHandler} />
          <Menu.Item name='following' active={activeMenu === 'following'} onClick={onClickHandler} />
          <Menu.Item name='saved' active={activeMenu === 'saved'} onClick={onClickHandler} />
        </Menu>
      </div>
      <StackGrid
        monitorImagesLoaded={true}
        columnWidth={150}
        gutterWidth={20}
        gutterHeight={20}
      >
        {notes.map(([noteId, note]) => <NoteCard key={noteId} {...note} />)}
      </StackGrid>
    </div>
  );
}

// [start] helper functions
const intersection = (array1, array2) => {
  return array1.filter(value => array2.includes(value));
}

const filterByProhibitTags = (querySnapshot, prohibitTags) => {
  return querySnapshot.docs.map(doc => [doc.id, doc.data()]).filter(([id, { tags }]) => intersection(tags, prohibitTags).length === 0);
}
// [end] helper functions

const mapStateToProps = (state) => ({
  prohibitTags: state.app.prohibitTags
});

export default connect(mapStateToProps)(NoteGallary);