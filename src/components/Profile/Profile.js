import React from 'react';
import { connect } from 'react-redux';

const Profile = ({ authUser }) => {
  return (
    <div>
      Profile
    </div>
  );
}

const mapStateToProps = (state) => ({
  authUser: state.auth.authUser
});

export default connect(mapStateToProps)(Profile);