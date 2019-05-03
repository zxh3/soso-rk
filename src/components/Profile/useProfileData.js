import { useState, useEffect } from 'react';
import { db } from '../../firebase';

const useProfileData = (username) => {
  const [profileData, setProfileData] = useState(null);

  useEffect(() => {
    db.collection('users').where('username', '==', username)
      .onSnapshot((querySnapshot) => {
        if (!querySnapshot.size) {
          setProfileData('!exists')
        } else if (querySnapshot.size === 1) {
          const _profileData = {
            id: querySnapshot.docs[0].id,
            data: querySnapshot.docs[0].data(),
            followers: null,
            following: null
          };
          Promise.all(_profileData.data.followers.map((uid) => db.collection('users').doc(uid).get()))
            .then((docs) => docs.map((doc) => doc.data()))
            .then((docsData) => {
              _profileData.followers = docsData;
              return Promise.all(_profileData.data.following.map((uid) => db.collection('users').doc(uid).get()));
            })
            .then((docs) => docs.map((doc) => doc.data()))
            .then((docsData) => {
              _profileData.following = docsData;
              setProfileData(_profileData);
            })
            .catch((error) => console.error(error));
        }
      });
  }, [username]);
  return profileData
}

export default useProfileData;