'use strict';
import React from 'react';
import eventemitter from '../eventemitter';

export default class Introduction extends React.Component {
  render() {
    const {youtubeId} = this.props;

    return (
      <div>
        <h1>Introduction</h1>
        <button onClick={() => eventemitter.emit('change', 'selection')}>close</button>
      </div>
    );
  }
}
