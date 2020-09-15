import '@tarojs/async-await'
import Taro, { Component } from '@tarojs/taro'
import { Provider } from '@tarojs/redux'
import tabHome from './pages/tabs/tabHome'
import dva from './utils/dva'
import models from './models/common'

import Index from './pages/index'

import './app.less'

// 如果需要在 h5 环境中开启 React Devtools
// 取消以下注释：
// if (process.env.NODE_ENV !== 'production' && process.env.TARO_ENV === 'h5')  {
//   require('nerv-devtools')
// }

const dvaApp = dva.createApp({
  initialState: {},
  models: models,
});
const store = dvaApp.getStore();

class App extends Component {

  componentDidMount() { }

  componentDidShow() { }

  componentDidHide() { }

  componentDidCatchError() { }

  config = {
    pages: [
      'pages/tabs/tabHome/index',
      'pages/tabs/tabArticle/index',
      'pages/tabs/tabQuestion/index',
      'pages/tabs/tabRecord/index',
      'pages/tabs/tabUser/index',

      'pages/login/index',//登录页面

    ],
    window: {
      backgroundTextStyle: 'light',
      navigationBarBackgroundColor: '#fff',
      navigationBarTitleText: 'WeChat',
      navigationBarTextStyle: 'black'
    },
    tabBar: {
      list: [
        {
          pagePath: "pages/tabs/tabHome/index",
          text: "首页",
          iconPath: "./images/tab/home.png",
          selectedIconPath: "./images/tab/home-active.png"
        },
        {
          pagePath: "pages/tabs/tabArticle/index",
          text: "星文",
          iconPath: "./images/tab/article.png",
          selectedIconPath: "./images/tab/article-active.png"
        },
        {
          pagePath: "pages/tabs/tabQuestion/index",
          text: "问答",
          iconPath: "./images/tab/question.png",
          selectedIconPath: "./images/tab/question-active.png"
        },
        {
          pagePath: "pages/tabs/tabRecord/index",
          text: "档案",
          iconPath: "./images/tab/record.png",
          selectedIconPath: "./images/tab/record-active.png"
        }, {
          pagePath: "pages/tabs/tabUser/index",
          text: "我的",
          iconPath: "./images/tab/user.png",
          selectedIconPath: "./images/tab/user-active.png"
        }
      ],
      color: '#333',
      selectedColor: '#6c5fd3',
      backgroundColor: '#fff',
      borderStyle: 'black'
    }
  }

  // 在 App 类中的 render() 函数没有实际作用
  // 请勿修改此函数
  render() {
    return (
      <Provider store={store}>
        <Index />
      </Provider>

    )
  }
}

Taro.render(<App />, document.getElementById('app'))
