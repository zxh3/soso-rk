import React, { useState } from 'react';
import useProhibitTags from './useProhibitTags';
import { List } from 'semantic-ui-react';
import firebase, { db } from '../../firebase';

const ProhibitTag = ({ authUser }) => {
  const uid = authUser.uid;
  const [currentValue, setCurrentValue] = useState('');
  const prohibitTags = useProhibitTags(uid);

  return (
    <div>

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
          <input type="text" value={currentValue} onChange={(e) => setCurrentValue(e.target.value)} />
          <input type="submit" value='Add' />
        </form>
      </div>

      <div>
        <List>
          {prohibitTags.map((tagName) => (
            <List.Item key={tagName} onClick={() => {
              db.collection('users').doc(uid)
                .update({
                  prohibitTags: firebase.firestore.FieldValue.arrayRemove(tagName)
                })
                .then(() => console.log('remove successfully'))
                .catch((error) => console.error(error));
            }}>
              {tagName}
            </List.Item>
          ))}
        </List>
      </div>

    </div>
  );
}

export default ProhibitTag;