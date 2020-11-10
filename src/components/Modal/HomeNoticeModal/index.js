import Taro from '@tarojs/taro';
import BaseComponent from "../../BaseComponent";
import { View, Image } from '@tarojs/components';
import { AtButton } from 'taro-ui';
import PropTypes from 'prop-types';
import './index.less';
import { ossUrl } from "../../../config";
import { goToCommonPage } from "../../../utils/common";
import { HOME_ALERT_TYPE } from "../../../pages/tabs/tabHome";

/**
 *  首页公告框 - alert组件
 */
class HomeNoticeModal extends BaseComponent {
  static propTypes = {
    data: PropTypes.object,//数据
    show: PropTypes.bool,//是否显示alert
    onClickAlertShadow: PropTypes.func,//点击阴影部分
  }

  static defaultProps = {};

  constructor() {
    super(...arguments)
    this.state = {}
  }

  componentDidMount = () => {
  }

  componentDidUpdate = () => {

  }

  //黑色透明背景点击事件
  actionBgClick = () => {
    this.log('actionBgClick');
    if (4 == this.props.data.type)
      return;
    this.props.onClickAlertShadow(HOME_ALERT_TYPE.NOTICE);
  }

  //底部按钮被点击
  actionBtnClick = () => {
    this.log('actionBtnClick')
    if (this.props.data.target == 'local') {
      goToCommonPage(this.props.data.link);
    } else {
      window.location.href = this.props.data.link;
    }
    this.props.onClickAlertShadow(HOME_ALERT_TYPE.NOTICE);
  }

  render() {
    const {
      show,
      data,
    } = this.props;

    if (!data)
      return

    this.log('HomeNoticeModal render show=' + show)

    return (
      <View>
        {show && (
          <View className='home-notice-modal-con'>

            <View className='info-con'>
              <View className='content-con'>
                {data.img_url && (
                  <Image
                    className='img-notice'
                    src={ossUrl + data.img_url}
                  />
                )}
                {/*标题*/}
                {data.title && (
                  <View className='title'>{data.title}</View>
                )}
                {/*内容*/}
                {data.content && (
                  <View className='content'>{data.content}</View>
                )}
                {/*按钮*/}
                {data.btn && (
                  <View className='btn-con'>
                    <AtButton className='btn' onClick={this.actionBtnClick}>{data.btn}</AtButton>
                  </View>
                )}

              </View>
            </View>
            {/*关闭按钮 4.每次都弹，不能关闭，没有关闭按钮（比如系统升级中等）；】*/}
            {4 != data.type && (
              <Image
                className='img-close'
                src={ossUrl + 'wap/images/rectification/icon_alert_cancle.png'}
                onClick={this.actionBgClick}
              />
            )}
            {/*黑色透明背景*/}
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

export default HomeNoticeModal;
