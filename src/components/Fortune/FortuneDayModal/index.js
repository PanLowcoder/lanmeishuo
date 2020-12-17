import Taro from '@tarojs/taro';
import BaseComponent from "../../BaseComponent";
import {View, Image} from '@tarojs/components';
import {AtModal, AtModalContent} from "taro-ui"
import PropTypes from 'prop-types';
import './index.scss';
import {ossUrl} from "../../../config";

const img_day_modal_header = ossUrl + 'wap/images/fortune/img_day_modal_header.png'
const img_day_modal_1 = ossUrl + 'wap/images/fortune/img_day_modal_1.png'
const img_day_modal_2 = ossUrl + 'wap/images/fortune/img_day_modal_2.png'

/**
 * 日运购买提示alert组件
 */
class FortuneDayModal extends BaseComponent {
  static propTypes = {
    data: PropTypes.object,
    show: PropTypes.bool,
    onClickModal: PropTypes.func,
  }

  static defaultProps = {
    data: '',
    show: false,
    onClickModal: function () {
      //this.log('onClickDay');
    },
  };

  constructor() {
    super(...arguments)
  }

  componentDidMount = () => {
    // this.setState({is_show: this.props.show});
  }

  componentDidUpdate = () => {
    // this.log('FortuneDayModal componentDidUpdate show=' + this.props.show);
    // this.setState({is_show: this.props.show});
  }

  //再考虑 被点击
  actionCancel = () => {
    this.log('actionCancel')
    this.props.onClickModal(0);
    // this.setState({user_clcik_cancle: true});
  }

  //去购买 被点击
  actionOk = () => {
    this.log('actionOk')
    this.props.onClickModal(1);
  }

  render() {

    return (
      <AtModal isOpened={this.props.show}>
        <AtModalContent className='day_modal'>
          {/*顶部图片*/}
          <Image className='header-img' src={img_day_modal_header}></Image>
          <View className='container'>
            {/*顶部标题*/}
            <View className='title'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;您只能免费查看当天运势，对于其他时间您有两种方式可以永久解锁：</View>
            {/*单条内容列表*/}
            <View className='list-container'>
              <View className='item-container'>
                <Image className='item-img' src={img_day_modal_1}></Image>
                <View className='text'>购买过的日运可以永久查看；</View>
              </View>
              <View className='second-container'>
                <Image className='second-img' src={img_day_modal_2}></Image>
                <View className='text'>对于过去的某日运势，如您做过运势日记，仍然可以免费查看。</View>
              </View>
            </View>
            {/*注意点*/}
            <View className='notice-container'>
              <View className='left-bg'></View>
              <View className='text'>购买后修改档案不会引起运势变动，请务必确认当前档案的准确性！</View>
            </View>
            {/*底部按钮*/}
            <View className='bottom-container'>
              <View className='cancle' onClick={this.actionCancel}>再考虑</View>
              <View className='ok' onClick={this.actionOk}>去购买</View>
            </View>
          </View>


        </AtModalContent>

      </AtModal>
    );
  }
}

export default FortuneDayModal;
