import { useState, useEffect } from 'react';
import { db } from '../../firebase';

const useUserData = (username) => {
  const [userData, setUserData] = useState(null);

  console.log(username);

  useEffect(() => {
    db.collection('users').where('username', '==', username)
      .get()
      .then((querySnapshot) => {
        if (!querySnapshot.size) {
          setUserData('!exists')
        } else if (querySnapshot.size === 1) {
          setUserData(querySnapshot.docs[0].data());
        }
      })
      .catch((error) => console.error(error));
  }, [username]);

  return userData
}

export default useUserData;