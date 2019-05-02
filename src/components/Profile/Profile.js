import React, { useState, useEffect } from 'react';
import styles from "./Profile.module.css";
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { Loader, Button, Image } from 'semantic-ui-react';
import useProfileData from './useProfileData';
import { NotesDisplay } from '../Note';
import firebase, { auth, db } from '../../firebase';



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

const useUserData = (authLoading, authUser) => {
  const [userData, setUserData] = useState(null);
  useEffect(() => {
    if (authLoading || authUser === null) { 
      return;
    } else {
      db.collection('users').doc(authUser.uid)
        .onSnapshot((doc) => {
          setUserData(doc.data());
        });
    }
  }, [authLoading, authUser]);
  return userData;
}

const Profile = ({ authLoading, authUser, match }) => {
  const username = match.params.username;
  const _profileData = useProfileData(username);
  const notes = useNotes(_profileData);
  const currentUserData = useUserData(authLoading, authUser);
  const [followButtonLoading, setFollowButtonLoading] = useState(false);

  if (_profileData === null || authLoading || (authUser && !currentUserData)) {
    return <Loader active />
  }

  if (_profileData === '!exists') {
    return (
      <div className={styles.doesNotExist}>
        <p>Sorry, user {username} does not exist.</p>
      </div>
    );
  }

  console.log(notes);

  const [profileUid, profileData] = _profileData;
  const { displayName, photoURL, followers, following } = profileData;

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

  const toggleFollow = (isFollowing) => {
    if (isFollowing) {
      return Promise.all([
        db.collection('users').doc(authUser.uid).update({
          following: firebase.firestore.FieldValue.arrayRemove(profileUid)
        }),
        db.collection('users').doc(profileUid).update({
          followers: firebase.firestore.FieldValue.arrayRemove(authUser.uid)
        })
      ]);
    } else {
      return Promise.all([
        
        db.collection('users').doc(authUser.uid).update({
          following: firebase.firestore.FieldValue.arrayUnion(profileUid)
        }),
        db.collection('users').doc(profileUid).update({
          followers: firebase.firestore.FieldValue.arrayUnion(authUser.uid)
        })
      ]);
    }
  }
    
  console.log('this is someone else\'s profile page');
  if (authUser && profileUid !== authUser.uid) {
    const isFollowingProfileUser = currentUserData.following.indexOf(profileUid) !== -1;
    return (
      <div>
        <div className={styles.profileContainer}>
          <div className={styles.userInfo}>
            <Image size='tiny' className={styles.image} key={photoURL} src={photoURL} />
            <div>{ displayName }</div>
            <div>
              <span style={{ marginRight: 6 }}>
                Follower: { followers.length }
              </span>
              <span>
                Following: { following.length } 
              </span> 
            </div>
            <Button loading={followButtonLoading} basic fluid onClick={() => {
              setFollowButtonLoading(true);
              toggleFollow(isFollowingProfileUser)
                .then(() => console.log('successfully toggle following'))
                .catch((error) => console.error(error))
                .finally(() => setFollowButtonLoading(false));
            }}>
              { isFollowingProfileUser ? 'Unfollow' : 'Follow'}
            </Button>
          </div>
          { notes ? <div className={styles.notesDisplay}><NotesDisplay notes={notes} /></div> : null }
        </div>
      </div>
    );
  }

  return (
    // This user is not signed in
    <div></div>
  );
}

const mapStateToProps = (state) => ({
  authUser: state.auth.authUser,
  authLoading: state.auth.authLoading
});

export default connect(mapStateToProps)(withRouter(Profile));