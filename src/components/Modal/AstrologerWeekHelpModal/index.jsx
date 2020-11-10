import Taro from '@tarojs/taro';
import BaseComponent from "../../BaseComponent";
import {View, Image} from '@tarojs/components';
import PropTypes from 'prop-types';
import './index.scss';
import {ossUrl} from "../../../config";

/**
 *  占星师周榜 - alert组件
 */
class AstrologerWeekHelpModal extends BaseComponent {
  static propTypes = {
    show: PropTypes.bool,//是否显示alert
    onClickAlertShadow: PropTypes.func,//点击阴影部分
  }

  static defaultProps = {};

  constructor() {
    super(...arguments)
    this.state = {
      text_arr:
        [
          '榜单按照占星师的强大次数排名',
          '抢答次数相同时，采纳率高的人排名较高',
          '榜单排名显示前20名',
          '计算时间为最近7天，每天零点更新榜单',
        ]
    }
  }

  componentDidMount = () => {
  }

  componentDidUpdate = () => {

  }

  actionItemClick = (e) => {
    let index = e.currentTarget.dataset.index;
    this.log('actionItemClick index=' + index);
  }

  actionBgClick = () => {
    this.log('actionBgClick');
    this.props.onClickAlertShadow();
  }

  render() {
    const {text_arr} = this.state;
    const {show} = this.props;

    return (
      <View>
        {show && (
          <View className='astrologer-week-help-modal-con'>
            <Image
              className='img-top'
              src={ossUrl + 'wap/images/platform/icon_weekcharts_dialog.png'}
            />
            <View className='info-con'>
              {text_arr.map((item, index) => (
                <View className='item-con'>
                  <Image
                    className='item-con-img-top'
                    src={ossUrl + 'wap/images/platform/icon_weekcharts_explain' + (index + 1) + '.png'}
                  />
                  <View className='item-con-text-des'>{item}</View>
                </View>
              ))}
            </View>
            <Image
              className='img-close'
              src={ossUrl + 'wap/images/rectification/icon_alert_cancle.png'}
              onClick={this.actionBgClick}
            />
            <View
              className='info-shandow-con'
              onClick={this.actionBgClick}
            />
          </View>
        )
        }
      </View>
    );
  }
}

export default AstrologerWeekHelpModal;
