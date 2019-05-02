import React, { useState } from 'react';
import { connect } from 'react-redux';
import styles from "./NotePage.module.css";
import { withRouter } from 'react-router-dom';
import { Loader, Form, Image } from 'semantic-ui-react';
import useNoteData from './useNoteData';
import Comments from './NotePageComments';
import shortid from 'shortid';
import moment from 'moment';
import firebase, { db } from '../../firebase';
import { Comment, Label, Icon } from 'semantic-ui-react';
import Carousel from 'nuka-carousel';


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

  console.log(noteData.imageUrls);

  return (
    <div className={styles.container}>
      <div className={styles.contentContainer}>

      <Carousel 
        className="styles.carousel"  
        renderTopCenterControls={({ currentSlide }) => (
          <div></div>
        )}
        renderCenterLeftControls={({ previousSlide }) => (
          <Icon onClick={previousSlide} className="grey angle left big"/>
        )}
        renderCenterRightControls={({ nextSlide }) => (
          <Icon onClick={nextSlide} className="grey angle right big"/>
        )}

        heightMode="current"
       >
        {noteData.imageUrls.map((url) => {
              return (
                <Image className={styles.image} key={url} src={url} onLoad={() => {
                  window.dispatchEvent(new Event("resize"));
                }} />
              )
            })}

      </Carousel>

        <div>
          <h3>{noteData.title}</h3>
        </div>    
        <div className={styles.content}>
          {noteData.content}
        </div>



      </div>


      <div className={styles.info}>
        <div className={styles.author} onClick={() => history.push(`/${noteData.author.username}`)}  >
          <Comment.Group>
            <Comment>
              <Comment.Avatar as='a' src={noteData.author.photoURL} />
              <Comment.Content>
                <Comment.Author>{noteData.author.displayName}</Comment.Author>
                <Comment.Metadata>
                  {moment(noteData.date.toDate()).fromNow()}
                </Comment.Metadata>
              </Comment.Content>
            </Comment>
          </Comment.Group>
        </div>

        <div className={styles.tags}>
          {noteData.tags.map((tag)=>{
            return (<Label className="ui tag label" key={tag}>{tag}</Label>);
            // return (<p>{tag}</p>)
          })}
        </div>




        {authUser 
          ? (
            <div className={styles.commentArea}>
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


        <div className={styles.comments}>
        <Comments comments={noteData.comments}/>
       </div>

      

      </div>




    </div>
  );
}

const mapStateToProps = (state) => ({
  authUser: state.auth.authUser
});

export default connect(mapStateToProps)(withRouter(NotePage));