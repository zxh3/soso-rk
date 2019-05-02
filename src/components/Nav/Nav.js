import React, { useState, useEffect } from 'react';
import styles from './Nav.module.css';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { Search } from 'semantic-ui-react';
import MenuBeforeSignIn from './MenuBeforeSignIn';
import MenuAfterSignIn from './MenuAfterSignIn';
import { db } from '../../firebase';
import _ from 'lodash';

const Nav = ({ authLoading, authUser, history, location }) => {
  const [value, setValue] = useState('');
  const [results, setResults] = useState([]);
  const [allNotes, setAllNotes] = useState([]);
  const [tagNotes, setTagNotes] = useState({});
  useEffect(() => {
    let notes = [];
    let withTag = {};
    db.collection('notes').get().then(querySnapshot => {
      querySnapshot.docs.forEach(doc => {
        notes.push([doc.id, doc.data()]);
        const tags = doc.data().tags;
        tags.map(tag => {
          if(tag in withTag){
            return withTag[tag].results.push({
              title: doc.data().title,
              image: doc.data().imageUrls[0],
              noteid: doc.id,
              key: doc.id
            });
          } else{
            return withTag[tag] = {
              name: tag,
              results: [{
                title: doc.data().title,
                image: doc.data().imageUrls[0],
                noteid: doc.id,
                key: doc.id
              }]
            };
          }
        });
      })
    });
    setAllNotes(notes);
    setTagNotes(withTag);
  }, []);

  const handleSearchChange = (e, { value }) => {
    setValue(value);
    if (value.length < 1) return setResults([]);
    const re = new RegExp(_.escapeRegExp(value), 'i');
    const isMatch = result => re.test(result[1].title);
    const re2 = new RegExp(_.escapeRegExp(value.substring(1)), 'i');
    const isMatchTag = (result, key) => {
      return re2.test(key);
    }
    if(value[0] === '#') {
      if(value.length < 2) return setResults([]);
      setResults(_.pickBy(tagNotes, isMatchTag));
     
    } else {
      setResults(
        _.filter(allNotes, isMatch).map((note) => {
          return {
            title: note[1].title,
            image: note[1].imageUrls[0],
            noteid: note[0],
            key: note[0]
          }
        }),
      );
    }
  }

  if (location.pathname === '/signin' || authLoading) {
    return null;
  }

  return (
    <div className={styles.container} onScroll={(e) => {
      console.log(e);
    }}>

      <div className={styles.logo} onClick={() => history.push('/')}>
        Soso
      </div>

      <div className={styles.search}>
        <Search
          category={value.length > 0 && value[0] === '#'}
          onSearchChange={handleSearchChange}
          results={results}
          value={value}
          selectFirstResult
          onResultSelect={(e, { result }) => {
            history.push(`/n/${result.noteid}`);
            setValue('');
          }}
        />
      </div>
      
      <div className={styles.menu}>
        { 
          authUser 
          ? <MenuAfterSignIn authUser={authUser} history={history} />
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