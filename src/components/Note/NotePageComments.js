import React from 'react';
import { Comment } from 'semantic-ui-react';
import moment from 'moment';

const NotePageComments = ({ comments }) => {
  comments.sort((a, b) => {
    return b.date.toDate() - a.date.toDate();
  });
  return (
    <Comment.Group>
      {comments.map((comment) => {
        return (
          <Comment key={comment.id}>
            <Comment.Avatar as='a' src={comment.avatarURL} />
            <Comment.Content>
              <Comment.Author>{comment.displayName}</Comment.Author>
              <Comment.Metadata>
                {moment(comment.date.toDate()).fromNow()}
              </Comment.Metadata>
              <Comment.Text>
                {comment.content}
              </Comment.Text>
            </Comment.Content>
          </Comment>
        );
      })}
    </Comment.Group>
  );
}

export default NotePageComments;