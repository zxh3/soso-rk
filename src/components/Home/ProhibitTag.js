import React, { useState } from 'react';
import { connect } from 'react-redux';
import { List } from 'semantic-ui-react';
import { actionToggleProhibitTag } from '../../redux/action';

const ProhibitTag = ({ prohibitTags, toggleProhibitTag }) => {
  const [currentValue, setCurrentValue] = useState('');
  return (
    <div>

      <div>
        <form onSubmit={(e) => {
          e.preventDefault();
          if (currentValue && (prohibitTags.indexOf(currentValue) === -1)) {
            toggleProhibitTag(currentValue);
          }
          setCurrentValue('');
        }}>
          <input type="text" value={currentValue} onChange={(e) => setCurrentValue(e.target.value)} />
          <input type="submit" value='Add' />
        </form>
      </div>

      <div>
        <List>
          {prohibitTags.map((tagName) => (
            <List.Item key={tagName} onClick={() => toggleProhibitTag(tagName)}>
              {tagName}
            </List.Item>
          ))}
        </List>
      </div>

    </div>
  );
}

const mapStateToProps = (state) => ({
  prohibitTags: state.app.prohibitTags
});

const mapDispatchToProps = (dispatch) => ({
  toggleProhibitTag: (tagName) => dispatch(actionToggleProhibitTag(tagName))
});

export default connect(mapStateToProps, mapDispatchToProps)(ProhibitTag);