'use strict';
import React, {PropTypes} from 'react';
import _ from 'lodash';
import eventemitter from '../eventemitter';
const {string, array} = PropTypes;

export default class Chapter extends React.Component {
  static defaultProps = {
    root: '',
    movies: []
  };
  static propTypes = {
    root: string.isRequired,
    movies: array.isRequired
  };
  componentDidMount() {
    const {root, movies} = this.props;

    console.log(root, movies);
  }
  render() {
    return (
      <div>
        <h1>Chapter</h1>
        <button onClick={() => eventemitter.emit('change', 'selection')}>close</button>
      </div>
    );
  }
}
