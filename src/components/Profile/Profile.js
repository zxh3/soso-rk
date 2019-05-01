import React from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { Loader } from 'semantic-ui-react';
import useUserData from './useUserData';

const Profile = ({ authLoading, authUser, match }) => {
  const username = match.params.username;
  const userData = useUserData(username);
  
  if (userData === '!exists') {
    return <div>User does not exsits</div>;
  }

  console.log(userData);
  if (authLoading) {
    return <Loader active />
  }
  return (
    <div>
      Profile
    </div>
  );
}

const mapStateToProps = (state) => ({
  authUser: state.auth.authUser,
  authLoading: state.auth.authLoading
});

export default connect(mapStateToProps)(withRouter(Profile));