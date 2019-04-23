import template from './index.pug';
import './index.less';

export default class App {
  attach(element) {
    element.innerHTML += template
  }
}
