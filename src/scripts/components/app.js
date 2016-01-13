'use strict';
import React from 'react';
import {Link} from 'react-router';
import Transition from 'react-motion-ui-pack';
import Introduction from './introduction';
import Chapter from './chapter';
import eventemitter from '../eventemitter';
import {characters, movies, introductionId} from '../data';

export default class App extends React.Component {
  state = {
    page: 'selection',
    root: ''
  };
  handleIntroductionClick = () => {
    const page = 'introduction';
    this.setState({page});
  };
  handleCharacterClick = (root) => {
    const page = 'chapter';
    this.setState({page, root});
  };
  componentDidMount() {
    eventemitter.on('change', page => this.setState({page}));
  }
  render() {
    const {page, root} = this.state;
    const {innerHeight} = window;

    return (
       <div>
        <h1>state => {page}</h1>

        <ul>
          <li onClick={this.handleIntroductionClick}>
            introduction
          </li>

          {characters.map(character => {
            const {id, name} = character;
            return (
              <li
                key={id}
                onClick={this.handleCharacterClick.bind(this, id)}>
                {name}
              </li>
            );
          })}
        </ul>

        <Transition
          component={false}
          enter={{
            // translateY: 0,
            opacity: 1
          }}
          leave={{
            // translateY: -innerHeight,
            opacity: 0
          }}>
          {page === 'introduction' && (
            <div
              key="introduction"
              className="fullscreen">
              <Introduction youtubeId={introductionId} />
            </div>
          )}
        </Transition>

        <Transition
          component={false}
          enter={{
            // translateY: 0,
            opacity: 1
          }}
          leave={{
            // translateY: -innerHeight,
            opacity: 0
          }}>
          {page === 'chapter' && (
            <div
              key="chapter"
              className="fullscreen">
              <Chapter
                root={root}
                movies={movies} />
            </div>
          )}
        </Transition>
      </div>
    );
  }
}
