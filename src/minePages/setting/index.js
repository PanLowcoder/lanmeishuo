import Taro from '@tarojs/taro';
import BaseComponent from "../../../components/BaseComponent";
import {View, Text} from '@tarojs/components';
import {connect} from '@tarojs/redux';
import './index.scss';

import {version} from '../../../config/index'
import {AtNavBar} from "taro-ui";
import {actionNavBack, removeCache, removeCacheExceptUserInfo} from "../../../utils/common";

@connect(({user, common}) => ({
  ...user,
  ...common,
}))
class setting extends BaseComponent {
  config = {
    navigationBarTitleText: '设置',
  };

  componentDidMount = () => {

  }

  componentDidShow = () => {
    this.log('setting componentDidShow');
  }

  goPage = (e) => {
    Taro.navigateTo({
      url: e.currentTarget.dataset.url,
    })
  }

  //清除缓存
  actionClearCache = () => {
    this.log('actionClearCache');
    Taro.showModal({
      cancelText: '取消',
      confirmText: '确定',
      confirmColor: '#FF6C89',
      content: '是否删除缓存？',
    })
      .then(res => {
        if (res.confirm) {
          removeCacheExceptUserInfo();
        }
      })
  }

  //退出登录
  outLogin = (e) => {
    e.stopPropagation();
    if (!this.props.access_token) {
      Taro.navigateTo({
        url: '/pages/login/index',
      })
      return;
    }
    Taro.showModal({
      cancelText: '取消',
      confirmText: '确定',
      confirmColor: '#FF6C89',
      content: '是否退出当前账号？',
    })
      .then(res => {
        if (res.confirm) {

          removeCache();

          this.props.dispatch({
            type: 'common/save',
            payload: {
              access_token: '',
              invitation_code: '',
              mobile: '',
              nickname: '',
              new_user: '',
              is_has_buy_card: '',
              erroMessage: '',
            },
          });
          this.props.dispatch({
            type: 'login/save',
            payload: {
              access_token: '',
              invitation_code: '',
              mobile: '',
              nickname: '',
              new_user: '',
              is_has_buy_card: '',
              erroMessage: '',
            },
          });

          Taro.redirectTo({url: '/pages/login/index'});
        }
      })
  }

  render() {
    return (
      <View className='setting-page'>
        {/*导航栏*/}
        <AtNavBar
          className='nav'
          onClickLeftIcon={this.actionNavBack}
          color='#000'
          title='设置'
          leftIconType='chevron-left'
          fixed={true}
        />
        <View className='list'>
          {/*版本号*/}
          <View className='item'>
            <View className='left'>
              <Text>版本号</Text>
            </View>
            <View className='right'>
              <View className='des'>V{version}</View>
            </View>
          </View>
          {/*关于我们*/}
          <View className='item' data-url='/minePages/mine/about/index' onClick={this.goPage}>
            <View className='left'>
              <Text>关于我们</Text>
            </View>
            <View className='right'>
              <View className='iconfont icon-arrow-right arrow'></View>
            </View>
          </View>
          {/*清除缓存*/}
          <View className='item' data-url='/pages/couponList/index' onClick={this.actionClearCache}>
            <View className='left'>
              <Text>清除缓存</Text>
            </View>
            <View className='right'>
              <View className='des'></View>
              <View className='iconfont icon-arrow-right arrow'></View>
            </View>
          </View>

          {/*分隔块*/}
          <View className='separate'></View>

          {/*退出登录*/}
          <View className='item' data-url='/minePages/mine/setting/index' onClick={this.outLogin}>
            <View className='left'>
              <Text>退出登录</Text>
            </View>
            <View className='right'>
              <View className='iconfont icon-arrow-right arrow'></View>
            </View>
          </View>

        </View>

      </View>
    )
  }



}

export default setting;
