import React from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { Loader } from 'semantic-ui-react';
import useProfileData from './useProfileData';

const Profile = ({ authLoading, authUser, match }) => {
  const username = match.params.username;
  const _profileData = useProfileData(username);

  if (_profileData === null || authLoading) {
    return <Loader active />
  }
  
  if (_profileData === '!exists') {
    return <div>User does not exsits</div>;
  }

  const [profileUid, profileData] = _profileData;
  const { displayName, photoURL, followers, following, notes } = profileData;

  // TODO
  if (profileUid === authUser.uid) {
    console.log('this is my profile page');
    // This is the user's own profile page
  } else {
    console.log('this is someone else\'s profile page');
    // other user's profile page, therefore should be able to follow/unfollow
  }

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