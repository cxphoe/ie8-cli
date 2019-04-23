import './index.less'

import React from 'react'
import ReactDom from 'react-dom'

export default class App extends React.PureComponent {
  componentDidMount() {
    console.log('box componentDidMount trigger')
  }

  render() {
    return (
      <div id='app'>
        <img src={require('./img/ie.jpg')}></img>
        <p>Hello, world.</p>
      </div>
    )
  }
}

