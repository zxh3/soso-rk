import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { Loader, Button, Image, Modal } from 'semantic-ui-react';
import useProfileData from './useProfileData';
import firebase, { auth, db } from '../../firebase';

const useUserData = (uid) => {
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

const FollowInfo = ({ uid }) => {
  db.collection('users').doc(uid).
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
  return (
    <div>
      <div className={styles.avatar}>
        <Image size='tiny' className={styles.image} key={photoURL} src={photoURL} circular={true}/>
      </div>

      <div> { displayName } </div>

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
  ) 
}
