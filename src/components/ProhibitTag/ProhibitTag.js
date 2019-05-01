import React, { useState } from 'react';
import styles from "./ProhibitTag.module.css";
import useProhibitTags from './useProhibitTags';
import { List, Input } from 'semantic-ui-react';
import firebase, { db } from '../../firebase';

const ProhibitTag = ({ authUser }) => {
  const uid = authUser.uid;
  const [currentValue, setCurrentValue] = useState('');
  const prohibitTags = useProhibitTags(uid);

  return (
    <div>

      <form onSubmit={(e) => {
        e.preventDefault();
        if (currentValue && (prohibitTags.indexOf(currentValue) === -1)) {
          db.collection('users').doc(uid)
            .update({
              prohibitTags: firebase.firestore.FieldValue.arrayUnion(currentValue)
            })
            .then(() => console.log('success'))
            .catch(error => console.error(error));
        }
        setCurrentValue('');
      }}>
        <Input 
          icon={{ name: 'eye slash', circular: true, link: true }} 
          placeholder='add a prohibit tag' 
          value={currentValue} 
          onChange={(e) => setCurrentValue(e.target.value)}
        />
        <Input type='submit' style={{ display: 'none' }}/>
      </form>

      <List className={styles.tagList}>
        {prohibitTags.map((tagName) => (
          <List.Item 
            key={tagName} 
            onClick={() => {
              db.collection('users').doc(uid)
                .update({
                  prohibitTags: firebase.firestore.FieldValue.arrayRemove(tagName)
                })
                .then(() => console.log('remove successfully'))
                .catch((error) => console.error(error));
            }}
          >
            <span className={styles.tagItem}>{tagName}</span>
          </List.Item>
        ))}
      </List>

    </div>
  );
}

export default ProhibitTag;