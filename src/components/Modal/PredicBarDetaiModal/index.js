import Taro from '@tarojs/taro';
import BaseComponent from "../../BaseComponent";
import {View, Image} from '@tarojs/components';
import {AtModal, AtModalContent} from "taro-ui"
import PropTypes from 'prop-types';
import './index.scss';
import {ossUrl} from "../../../config";

const icon_natal_cancel = ossUrl + 'wap/images/astro/predict/icon_natal_cancel.png'

/**
 * 本命解读-柱状图点击详情 alert组件
 */
class PredicBarDetaiModal extends BaseComponent {
  static propTypes = {
    item: PropTypes.object,//传过来的数据对象
    show: PropTypes.bool,//是否显示alert
    onAlertCancleClick: PropTypes.func,//点击取消按钮事件
  }

  static defaultProps = {
    show: false,
  };

  constructor() {
    super(...arguments)
    this.state = {
    }
  }

  componentDidMount = () => {
  }

  componentDidUpdate = () => {
  }

  actionCancle = () => {
    this.log('actionCancle');
    this.props.onAlertCancleClick();
  }

  render() {
    const {item, show} = this.props;

    return (
      <View>
        {item && (
          <AtModal className='predict-modal-con' isOpened={show}>
            <AtModalContent className='content-con'>
              <View className='con'>
                {/*顶部背景*/}
                <Image className='img' src={item && item.img}></Image>
                {/*中间内容*/}
                <View class='title-con'>
                  <View class='sep'></View>
                  <View class='title'>{item && item.title}</View>
                  <View class='sep'></View>
                </View>
                <View class='des'>{item && item.des}</View>
                <View class='hint'>具体请等待后续推出的详细分析</View>
              </View>
            </AtModalContent>

            {/*底部取消按钮*/}
            <View className='bottom-cancle-con' onClick={this.actionCancle}>
              <Image className='img-cancle' src={icon_natal_cancel}></Image>
            </View>

          </AtModal>
        )
        }
      </View>

    )
      ;
  }
}

export default PredicBarDetaiModal;
