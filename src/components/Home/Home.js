import React from 'react';
import styles from "./Home.module.css";
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { Loader } from 'semantic-ui-react';
import { AddNote, NoteGallary } from '../Note';
import ProhibitTag from '../ProhibitTag';
import { auth } from '../../firebase';

const Home = ({ authLoading, authUser }) => {
  if (authLoading) {
    return <Loader active />
  } else if (authUser === null) {
    return <Redirect to='/signin' />
  }
  return (
    <div className={styles.container}>
      <button onClick={() => auth.signOut()}>Sign Out</button>
      <div className={styles.notesGallary}>
        <NoteGallary authUser={authUser} />
      </div>
      <div className={styles.prohibitTag}>
        <ProhibitTag authUser={authUser} />
      </div>
      <div className={styles.addNote}>
        <AddNote authUser={authUser} />
      </div>
    </div>
  );
}

const mapStateToProps = (state) => ({
  authUser: state.auth.authUser,
  authLoading: state.auth.loading
});

export default connect(mapStateToProps)(Home);