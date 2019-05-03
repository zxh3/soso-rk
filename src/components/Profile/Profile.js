import React, { useState, useEffect } from 'react';
import styles from "./Profile.module.css";
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { Loader, Button, Image, Modal, List } from 'semantic-ui-react';
import useProfileData from './useProfileData';
import { NotesDisplay } from '../Note';
import firebase, { auth, db } from '../../firebase';

const useNotes = (profileData) => {
  const [notes, setNotes] = useState(null);
  useEffect(() => {
    if (profileData && profileData !== '!exists') {
      const noteIds = profileData.data.notes;
      Promise.all(noteIds.map((noteId) => db.collection('notes').doc(noteId).get()))
        .then((docs) => docs.map((doc) => [doc.id, doc.data()]))
        .then((notesData) => setNotes(notesData))
        .catch((error) => console.error(error));
    }
  }, [profileData]);
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

const FollowModal = ({ followModalProp, setFollowModalProp, followData, history }) => {
  return (
    <Modal
      open={followModalProp !== null}
      onClose={() => setFollowModalProp(null)}
      size='mini'
    >
      <Modal.Content>
        <List>
        { followData.map((userData) => {
          const { username, photoURL, displayName } = userData;
          return (
            <List.Item key={username} 
              onClick={() => {
                setFollowModalProp(null);
                history.push(`/${username}`)
              }}
              style={{ cursor: 'pointer' }}  
            >
              <Image avatar src={photoURL} />
              <List.Content>
                <List.Header>
                  {username}
                </List.Header>
                <List.Description>
                  {displayName}
                </List.Description>
              </List.Content>
            </List.Item>
          );
        }) }
        </List>
      </Modal.Content>
    </Modal>
  );
}

const Profile = ({ authLoading, authUser, match, history }) => {
  const username = match.params.username;
  const _profileData = useProfileData(username);
  const notes = useNotes(_profileData);
  const currentUserData = useUserData(authLoading, authUser);
  const [followButtonLoading, setFollowButtonLoading] = useState(false);
  const [followModalProp, setFollowModalProp] = useState(null);

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

  const profileUid = _profileData.id;
  const profileData = _profileData.data;
  const { displayName, photoURL, followers, following } = profileData;
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

  if (authUser && profileUid === authUser.uid) {
    console.log('this is my profile page');
    return (
      <div className={styles.profileContainer}>
        <div className={styles.userInfo}>
          <Image size='tiny' className={styles.image} key={photoURL} src={photoURL} circular={true}/>
          <div style={{ fontWeight: 'bold' }}>{ displayName }</div>
          <div onClick={() => setFollowModalProp({follower: true})} style={{cursor: 'pointer'}}> 
            Follower: { followers.length }
          </div>
          <div onClick={() => setFollowModalProp({follower: false})} style={{cursor: 'pointer'}}>
            Following: { following.length } 
          </div> 
          <div className={styles.signOutContainer}>
            <Button negative onClick={() => auth.signOut()}>Sign Out</Button>
          </div>
        </div>        
        { notes ? <div className={styles.notesDisplay}><NotesDisplay notes={notes} /></div> : null }
        <FollowModal 
          history={history}
          followModalProp={followModalProp}
          setFollowModalProp={setFollowModalProp} 
          followData={ (followModalProp && followModalProp.follower) ? _profileData.followers : _profileData.following } 
        />
      </div>
    );
  }
 
  if (authUser && profileUid !== authUser.uid) {
    console.log('this is someone else\'s profile page');
    const isFollowingProfileUser = currentUserData.following.indexOf(profileUid) !== -1;
    return (
      <div className={styles.profileContainer}>
        <div className={styles.userInfo}>
          <Image size='tiny' className={styles.image} key={photoURL} src={photoURL} circular={true}/>
          <div>{ displayName }</div>
          <div onClick={() => setFollowModalProp({ follower: true })} style={{cursor: 'pointer'}}> 
            Follower: { followers.length }
          </div>
          <div onClick={() => setFollowModalProp({ follower: false })} style={{cursor: 'pointer'}}>
            Following: { following.length } 
          </div> 
          <Button loading={followButtonLoading} basic fluid onClick={() => {
            setFollowButtonLoading(true);
            toggleFollow(isFollowingProfileUser)
              .then(() => console.log('successfully toggle following'))
              .catch((error) => console.error(error))
              .finally(() => setFollowButtonLoading(false));
          }} active={!isFollowingProfileUser} >
            { isFollowingProfileUser ? 'Unfollow' : 'Follow'}
          </Button>
        </div>
        { notes ? <div className={styles.notesDisplay}><NotesDisplay notes={notes} /></div> : null }
        <FollowModal 
          history={history}
          followModalProp={followModalProp}
          setFollowModalProp={setFollowModalProp} 
          followData={ (followModalProp && followModalProp.follower) ? _profileData.followers : _profileData.following } 
        />
      </div>
    );
  }

  console.log('This user is not signed in');
  return (
    // This user is not signed in
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh', fontWeight: 'bold' }}>
      Sign in to see the user's profile.
    </div>
  );
}

const mapStateToProps = (state) => ({
  authUser: state.auth.authUser,
  authLoading: state.auth.authLoading
});

export default connect(mapStateToProps)(withRouter(Profile));