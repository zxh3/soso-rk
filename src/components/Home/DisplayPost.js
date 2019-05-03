import React, { Component } from 'react';
import styles from './DisplayPost.module.scss';
import { baseUrl } from '../baseUrl.js';
import axios from 'axios';

class DisplayPost extends Component {
  state = {
    results: [],
  }

  componentDidMount() {
    axios.get(`${baseUrl}&offset=${offset}&limit=${limit}`)
      .then(response => {
        this.setState({
          results: response.data.data.results,
        });
      })
      .catch(err => console.error(err)); 
    offset += limit;
  }

  handleLoadMore = (e) => {
    let newdata = []
    axios.get(`${baseUrl}&offset=${offset}&limit=${limit}`)
      .then(response => {
        newdata = response.data.data.results;
        this.setState(state => ({
          results: [...state.results, ...newdata],
          previous_results: [...state.results, ...newdata],
        }));
        })
      .catch(err => console.error(err)); 
    offset += limit;
  }

  render() {
    return (
      <div className={styles["post-container"]}>
        <div className={styles['comic-container']}>
          {this.state.results.map((comic, index) => <GalleryCard comic={comic} key={index} />)}
        </div>
        <button className={styles["loadMore"]} onClick={this.handleLoadMore}> Load More </button>
      </div>
    );
  }
}

export default DisplayPost;