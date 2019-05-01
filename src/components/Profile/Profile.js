import React from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { Loader } from 'semantic-ui-react';
import useUserData from './useUserData';

const Profile = ({ authLoading, authUser, match }) => {
  const username = match.params.username;
  const userData = useUserData(username);

  if (userData === null || authLoading) {
    return <Loader active />
  }
  
  if (userData === '!exists') {
    return <div>User does not exsits</div>;
  }

  const { displayName, photoURL, followers, following, notes } = userData;

  // TODO

  return (
    <div>
      { displayName }
    </div>
  );
}

const mapStateToProps = (state) => ({
  authUser: state.auth.authUser,
  authLoading: state.auth.authLoading
});

export default connect(mapStateToProps)(withRouter(Profile));