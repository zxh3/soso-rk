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
          setProfileData([querySnapshot.docs[0].id, querySnapshot.docs[0].data()]);
        }
      });
  }, [username]);
  return profileData
}

export default useProfileData;