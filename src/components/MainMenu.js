import React from 'react';
import styles from './MainMenu.module.css'
import { changeMainMenuActiveItem } from '../redux/action';
import { connect } from 'react-redux';

const MainMenu = ({ activeItem, changeActiveItem }) => {

  const itemClassName = (active) => {
    return `${styles.menuItem} ${active
      ? styles.activeItem
      : ''}`;
  }

  return (
    <div className={styles.container}>
      <ul className={styles.menu}>
        <li className={itemClassName(activeItem === 'Follow')} onClick={() => changeActiveItem('Follow')}>
          Follow
        </li>
        <li className={itemClassName(activeItem === 'Trending')} onClick={() => changeActiveItem('Trending')}>
          Trending
        </li>
        <li className={itemClassName(activeItem === 'Saved')} onClick={() => changeActiveItem('Saved')}>
          Saved
        </li>
      </ul>
    </div>
  );
}

const mapStateToProps = (state) => ({
  activeItem: state.app.mainMenuActiveItem
});

const mapDispatchToProps = (dispatch) => ({
  changeActiveItem: (activeItem) => dispatch(changeMainMenuActiveItem(activeItem))
});

export default connect(mapStateToProps, mapDispatchToProps)(MainMenu);