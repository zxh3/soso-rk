import React, { useState } from 'react';
import { Modal, Popup, Icon, Button } from 'semantic-ui-react';

const AddNote = () => {
  const [modalOpen, setModalOpen] = useState(true);

  const trigger = (
    <Icon 
      size='big' 
      name='add circle'
      onClick={() => setModalOpen(_modalOpen => !_modalOpen)}
      style={{cursor: 'pointer'}}
    />
  );

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
        closeOnDimmerClick={false}
      >
        <Modal.Header>
          Create A New Note
        </Modal.Header>
        <Modal.Content>
          Content
          <Modal.Description>
            Description
          </Modal.Description>
        </Modal.Content>
        <Modal.Actions>
          <Button
            color='green'
          >
            <Icon name='checkmark' /> Create
          </Button>
        </Modal.Actions>
      </Modal>
    </div>
  );
}

export default AddNote;