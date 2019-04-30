import React, { useState } from 'react';
import { withRouter } from 'react-router-dom';
import { Modal, Popup, Icon, Button, Form, Label } from 'semantic-ui-react';
import shortid from 'shortid';
import { toast } from 'react-toastify';
import firebase, { db, storage } from '../../firebase';

const AddNote = ({ authUser, history }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [currentTagValue, setCurrentTagValue] = useState('');

  // notes data
  const { uid } = authUser;
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState([]);
  const [files, setFiles] = useState([]);

  const trigger = (
    <Icon 
      size='big' 
      name='add circle'
      onClick={() => setModalOpen(_modalOpen => !_modalOpen)}
      style={{cursor: 'pointer'}}
    />
  );

  const onSubmitHandler = (e) => {
    e.preventDefault();
    const storageRef = storage.ref();
    const noteImageRefs = Array.from(Array(files.length), () => storageRef.child(shortid.generate()));
    Promise.all(noteImageRefs.map((noteImageRef, index) => noteImageRef.put(files[index])))
      .then((snapshots) => Promise.all(noteImageRefs.map((noteImageRef) => noteImageRef.getDownloadURL())))
      .then((urls) => db.collection('notes').add({
        title,
        content,
        tags,
        imageUrls: urls,
        comments: [],
        likes: [],
        saves: [],
        date: firebase.firestore.Timestamp.fromDate(new Date()),
        uid
      }))
      .then((docRef) => db.collection('users').doc(uid).update({
        notes: firebase.firestore.FieldValue.arrayUnion(docRef.id)
      }))
      .then(() => {
        toast.success('Create Note Successfully');
        setTitle('');
        setContent('');
        setTags([]);
        setFiles([]);
      })
      .catch((error) => console.error(error))
      .finally(() => setModalOpen(false));
  }

  return (
    <div>
      <Popup 
        trigger={trigger}
        content='Create a new note'
      />

      <Modal 
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        closeIcon
      >
        <Modal.Header>
          Create A Note
        </Modal.Header>
        <Modal.Content>

          <Form onSubmit={onSubmitHandler} id='noteForm'>
            <Form.Input required label='title' value={title} onChange={(e, { value }) => setTitle(value)} />
            <Form.TextArea required label='content' value={content} onChange={(e, { value }) => setContent(value)} />
            <Form.Input required multiple type='file' accept='image/*' onChange={(e) => setFiles(e.target.files)} />
            <Form.Input
              placeholder='add tags'
              value={currentTagValue}
              onChange={(e, { value }) => setCurrentTagValue(value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  if (currentTagValue.length > 0 && !tags.find(tag => tag === currentTagValue))
                    setTags(oldTags => [currentTagValue.toLowerCase(), ...oldTags])
                  setCurrentTagValue('');
                  e.preventDefault();
                }
              }}
            />
            {
              tags.map((tag, index) => (
              <Label
                key={index}
                onClick={() => setTags(oldTags => oldTags.filter(oldTag => oldTag !== tag))}
                style={{cursor: 'pointer'}}
              >
                {tag}
                <Icon name='delete' />
              </Label>))
            }

          </Form>

        </Modal.Content>
        <Modal.Actions>
          <Button
            form='noteForm'
            type='submit'
            color='green'
          >
            Create
          </Button>
        </Modal.Actions>
      </Modal>
    </div>
  );
}

export default withRouter(AddNote);