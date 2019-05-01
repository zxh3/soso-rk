import React from 'react';
import { connect } from 'react-redux';
import styles from "./NoteCard.module.css";
import { withRouter } from 'react-router-dom';
import moment from 'moment';
import { Card, Image, Icon } from 'semantic-ui-react';
import firebase, { db } from '../../firebase';

const NoteCard = (props) => {
  const { authUser, noteId, title, imageUrls, likes, saves, date, history } = props;
  const liked = likes.indexOf(authUser.uid) !== -1;
  const saved = saves.indexOf(authUser.uid) !== -1;
  return (
    <div>
      <Card>
        <Image className={styles.image} src={imageUrls[0]} onClick={() => history.push(`/n/${noteId}`)} />
        <Card.Content>
          <Card.Header>
            {title}
          </Card.Header>
          <Card.Meta>
            {moment(date.toDate()).fromNow()}
          </Card.Meta>
        </Card.Content>
        <Card.Content extra style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div>
            <Icon 
              color={liked ? 'red' : null} 
              name='like' 
              onClick={() => {
                if (!liked) {
                  db.collection('notes').doc(noteId).update({
                    likes: firebase.firestore.FieldValue.arrayUnion(authUser.uid)
                  });
                } else {
                  db.collection('notes').doc(noteId).update({
                    likes: firebase.firestore.FieldValue.arrayRemove(authUser.uid)
                  });
                }
              }} 
            />
            {likes.length} likes
          </div>
          <div>
            <Icon 
              color={saved ? 'yellow' : null} 
              name='star' 
              onClick={() => {
                if (!saved) {
                  db.collection('notes').doc(noteId)
                    .update({
                      saves: firebase.firestore.FieldValue.arrayUnion(authUser.uid)
                    })
                    .then(() => {
                      db.collection('users').doc(authUser.uid).update({
                        saved: firebase.firestore.FieldValue.arrayUnion(noteId)
                      })
                    });
                } else {
                  db.collection('notes').doc(noteId)
                    .update({
                      saves: firebase.firestore.FieldValue.arrayRemove(authUser.uid)
                    })
                    .then(() => {
                      db.collection('users').doc(authUser.uid).update({
                        saved: firebase.firestore.FieldValue.arrayRemove(noteId)
                      })
                    })
                }
              }}
            />
            {saves.length} saves
          </div>

        </Card.Content>
      </Card>
    </div>
  );
}

const mapStateToProps = (state) => ({
  authUser: state.auth.authUser
});

export default connect(mapStateToProps)(withRouter(NoteCard));