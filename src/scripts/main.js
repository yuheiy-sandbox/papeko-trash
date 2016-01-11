'use strict';
import React from 'react';
import { render } from 'react-dom';
import App from './components/app';

const init = () => {
  render(<App />, document.getElementById('app'));
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
