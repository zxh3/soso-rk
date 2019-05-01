import { useState, useEffect } from 'react';
import { db } from '../../firebase';

const useProhibitTags = (uid) => {
  const [prohibitTags, setProhibitTags] = useState([]);
  useEffect(() => {
    const unsubscribe = db.collection('users').doc(uid)
      .onSnapshot((doc) => {
        if (doc.exists) {
          setProhibitTags(doc.data().prohibitTags);
        }
      })
    return unsubscribe;
  }, [uid]);
  return prohibitTags;
}

export default useProhibitTags;