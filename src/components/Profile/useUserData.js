import { useState, useEffect } from 'react';
import { db } from '../../firebase';

const useUserData = (username) => {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    db.collection('users').where('username', '==', username)
      .get()
      .then((doc) => {
        if (!doc.exists) {
          setUserData('!exists')
        } else {
          setUserData(doc.data());
        }
      })
      .catch((error) => console.error(error));
  }, [username]);

  return userData
}

export default useUserData;