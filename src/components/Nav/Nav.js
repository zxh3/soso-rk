import React from 'react';
import styles from './Nav.module.css';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { Search } from 'semantic-ui-react';
import MenuBeforeSignIn from './MenuBeforeSignIn';
import MenuAfterSignIn from './MenuAfterSignIn';

const Nav = ({ authLoading, authUser, history, location }) => {
  if (location.pathname === '/signin' || authLoading) {
    return null;
  }

  return (
    <div className={styles.container}>

      <div className={styles.logo}>
        Logo
      </div>

      <div className={styles.search}>
        <Search />
      </div>
      
      <div className={styles.menu}>
        { 
          authUser 
          ? <MenuAfterSignIn />
          : <MenuBeforeSignIn history={history} />
        }
      </div>
    </div>
  );
}

const mapStateToProps = (state) => ({
  authUser: state.auth.authUser,
  authLoading: state.auth.loading
});

export default connect(mapStateToProps)(withRouter(Nav));