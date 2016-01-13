'use strict';
import 'babel-polyfill';
import React from 'react';
import {render} from 'react-dom';
import App from './components/app';

const init = () => {
  render(<App />, document.querySelector('#app'));
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
