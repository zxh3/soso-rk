import React from 'react';
import moment from 'moment';
import { Card, Image, Icon } from 'semantic-ui-react';

const NoteCard = (props) => {
  const { title, imageUrls, likes, date } = props;
  return (
    <div>
      <Card>
        <Image src={imageUrls[0]} />
        <Card.Content>
          <Card.Header>
            {title}
          </Card.Header>
          <Card.Meta>
            {moment(date.toDate()).fromNow()}
          </Card.Meta>
        </Card.Content>
        <Card.Content extra>
          <Icon name='like' />
          {likes.length} likes
        </Card.Content>
      </Card>
    </div>
  );
}

export default NoteCard;