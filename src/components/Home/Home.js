import React from 'react';
import styles from "./Home.module.css";
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { Loader } from 'semantic-ui-react';
import { AddNote } from '../Note';

const Home = ({ authLoading, authUser }) => {
  if (authLoading) {
    return <Loader active />
  } else if (authUser === null) {
    return <Redirect to='/signin' />
  }
  return (
    <div className={styles.container}>
      <div className={styles.notesGallary}>Notes Gallary</div>
      <div>Prohibited Tags</div>
      <div className={styles.addNote}><AddNote /></div>
    </div>
  );
}

const mapStateToProps = (state) => ({
  authUser: state.auth.authUser,
  authLoading: state.auth.loading
});

export default connect(mapStateToProps)(Home);