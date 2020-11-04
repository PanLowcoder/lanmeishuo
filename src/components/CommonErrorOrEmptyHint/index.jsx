import Taro from '@tarojs/taro';
import BaseComponent from "../BaseComponent";
import { View, Image } from '@tarojs/components';
import PropTypes from 'prop-types';
import './index.less';
import { ossUrl } from "../../config";

const img_error = ossUrl + 'wap/images/common/img_error.png'
const img_error_empty = ossUrl + 'wap/images/common/img_error_empty.png'
const img_error_no_network = ossUrl + 'wap/images/common/img_error_no_network.png'

/**
 * 提示类型，待定 0：无网络；1：页面出现错误；2：**页面数据为空
 * @type {{ERROR: number, NO_NETWORK: number, EMPTY: number}}
 */
export const ERROR_TYPE = {
  NO_NETWORK: 0,
  ERROR: 1,
  EMPTY: 2,
}

/**
 * 错误提示组件
 */
class CommonErrorOrEmptyHint extends BaseComponent {
  static propTypes = {
    type: PropTypes.number,//提示类型，待定 0：无网络；1：页面出现错误；2：**页面数据为空
    des: PropTypes.string,//提示文字
    onClickErrorOrEmpty: PropTypes.func,
  }

  static defaultProps = {
    type: 2,
    des: '',
    onClickErrorOrEmpty: function () {
      this.log('CommonErrorOrEmptyHint onClickErrorOrEmpty');
    },
  };

  constructor() {
    super(...arguments)
    this.state = {
      // text: '',//处理后，显示的文字
      // is_open: 0,
    }
  }

  componentDidMount = () => {
    this.log('CommonErrorOrEmptyHint componentDidMount ' + this.props.des);
    Taro.getNetworkType({
      success: res => this.log(res.networkType)
    })
      .then(res => this.log(res.networkType))
    Taro.onNetworkStatusChange(res => {
      this.log(res.isConnected)
      this.log(res.networkType)
    })
  };

  componentDidUpdate = () => {
    this.log('CommonErrorOrEmptyHint componentDidUpdate ' + this.props.des);
  };

  //重试按钮 被点击
  onClickErrorOrEmpty = () => {
    this.log('CommonErrorOrEmptyHint onClickErrorOrEmpty');
  }

  render() {
    const { des, type } = this.props;
    // const {font_size} = this.props;

    // 提示类型，待定 0：无网络；1：页面出现错误；2：**页面数据为空
    let img = img_error;
    let text = '';
    switch (type) {
      case 0: {
        img = img_error_no_network;
        text = '无网络连接，请检查网络设置~';
        break
      }
      case 1: {
        img = img_error;
        text = des;
        break;
      }
      case 2: {
        img = img_error_empty;
        text = des;
        break;
      }

    }


    return (

      <View className='error-or-empty-page' onClick={this.onClickErrorOrEmpty}>
        {des && (
          <View className='container'>
            <Image
              className='empty-img'
              src={img}
            />
            <View className='des'>
              {text}
            </View>
          </View>
        )}
      </View>

    )
  }
}

export default CommonErrorOrEmptyHint;
