import React, { useState, useEffect } from 'react';
import styles from "./Profile.module.css";
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { Loader, Icon, Button } from 'semantic-ui-react';
import useProfileData from './useProfileData';
import { NotesDisplay } from '../Note';
import { auth, db } from '../../firebase';


const useNotes = (_profileData) => {
  const [notes, setNotes] = useState(null);
  useEffect(() => {
    if (_profileData && _profileData !== '!exists') {
      const noteIds = _profileData[1].notes;
      Promise.all(noteIds.map((noteId) => db.collection('notes').doc(noteId).get()))
        .then((docs) => docs.map((doc) => [doc.id, doc.data()]))
        .then((notesData) => setNotes(notesData))
        .catch((error) => console.error(error));
    }
  }, [_profileData]);
  return notes;
}

const Profile = ({ authLoading, authUser, match }) => {
  const username = match.params.username;
  const _profileData = useProfileData(username);
  const notes = useNotes(_profileData)

  if (_profileData === null || authLoading) {
    return <Loader active />
  }
  
  if (_profileData === '!exists') {
    return (
      <div className={styles.doesNotExist}>
        <p>Sorry, user {username} does not exist.</p>
      </div>
    );
  }

  const [profileUid, profileData] = _profileData;
  const { displayName, photoURL, followers, following } = profileData;

  // TODO
  if (authUser && profileUid === authUser.uid) {
    console.log('this is my profile page');
    return (
      <div>
        <div className={styles.signOutContainer}>
          <Button negative onClick={() => auth.signOut()}>Sign Out</Button>
        </div>
        

        { notes ? <NotesDisplay notes={notes} /> : null}

      </div>
    );
  }
    
  console.log('this is someone else\'s profile page');
  return (
    <div>
      { displayName }
    </div>
  );
}

const mapStateToProps = (state) => ({
  authUser: state.auth.authUser,
  authLoading: state.auth.authLoading
});

export default connect(mapStateToProps)(withRouter(Profile));