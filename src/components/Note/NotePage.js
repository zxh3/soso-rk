import React, { useState } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Loader, Form, Image } from 'semantic-ui-react';
import useNoteData from './useNoteData';
import Comments from './NotePageComments';
import shortid from 'shortid';
import moment from 'moment';
import firebase, { db } from '../../firebase';

const NotePage = ({ history, match, authUser }) => {
  const noteId = match.params.noteid;
  const noteData = useNoteData(noteId);
  const [commentText, setCommentText] = useState('');
  if (noteData === null) {
    return <Loader active/>
  }

  if (noteData === '!exists') {
    return <div>Note does not exists</div>;
  }

  return (
    <div>

      <div onClick={() => history.push(`/${noteData.author.username}`)} style={{ cursor: 'pointer' }} >
        author: {noteData.author.displayName}
      </div>

      <div>
        {noteData.imageUrls.map((url) => {
          return (
            <Image key={url} src={url} />
          )
        })}
      </div>

      <div>
        {moment(noteData.date.toDate()).fromNow()}
      </div>

      <div>
        content: {noteData.content}
      </div>

      <div>
        <Comments comments={noteData.comments}/>
      </div>


      {authUser 
        ? (
          <div>
            {/* Comment Form */}
            <Form onSubmit={(e) => {
              e.preventDefault();
              setCommentText('');
              const commentData = {
                id: shortid.generate(),
                uid: authUser.uid,
                avatarURL: authUser.photoURL,
                displayName: authUser.displayName,
                content: commentText,
                date: firebase.firestore.Timestamp.fromDate(new Date()),
              }
              db.collection('notes').doc(noteId).update({
                comments: firebase.firestore.FieldValue.arrayUnion(commentData)
              })
                .then(() => console.log('add comment successfully'))
                .catch((error) => console.error(error));
            }}>
              <Form.TextArea value={commentText} onChange={(e, { value }) => setCommentText(value)} />
              <Form.Button type='submit'>Submit</Form.Button>
            </Form>
          </div>
        )
        : null}

    </div>
  );
}

const mapStateToProps = (state) => ({
  authUser: state.auth.authUser
});

export default connect(mapStateToProps)(withRouter(NotePage));