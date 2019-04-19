import React, { Component } from 'react';
import { Search } from 'semantic-ui-react'

class SearchBar extends Component {
  // state = {
  //   "isLoading": false,
  //   "results": [],
  //   "value": ""
  // }

  render() {
    return (
      <div className="row">
      <Search 
        input={{ icon: 'search', iconPosition: 'left', fluid: true }}
      />
      {/* <Search
            loading={isLoading}
            onResultSelect={this.handleResultSelect}
            onSearchChange={_.debounce(this.handleSearchChange, 500, { leading: true })}
            results={results}
            value={value}
            {...this.props}
          /> */}
      </div>
    );
  }
}

export default SearchBar;
