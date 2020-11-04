import Taro, {Component} from '@tarojs/taro';
import {noConsole} from "../config";
import {uploadImage} from "../utils/request";

/**
 * 基类
 */
class BaseComponent extends Component {
  config = {
    navigationBarTitleText: '准了',
  };

  constructor() {
    super(...arguments)
  }

  /**
   * 日志输出设置方法
   * @param str
   */
  log(str) {
    if (!noConsole) {
      console.log(str)
    }
  }

  /**
   * 通用的返回事件
   */
  actionNavBack() {
    Taro.navigateBack();
  }


  /**
   * 网络请求-头像上传
   * @param path
   * @param callback
   * @returns {Promise<void>}
   */
  async requestUploadImg(url, path, callback) {
    Taro.showLoading({
      title: '上传中...',
      mask: true,
    });

    await uploadImage(url, path, function (res) {
      Taro.hideLoading();
      console.log('requestUploadImg')
      console.log(res.data)
      callback(res.data)
    })
  }


}

export default BaseComponent;
