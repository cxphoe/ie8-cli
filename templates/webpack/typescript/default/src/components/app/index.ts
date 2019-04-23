import './index.less'
import template from './index.pug'

export default class App {
  attach(element: Element) {
    element.innerHTML += template
  }
}
