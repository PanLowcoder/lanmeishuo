import Taro from '@tarojs/taro';
import BaseComponent from "../../../components/BaseComponent";
import {View, Input, Image, ScrollView} from '@tarojs/components';
import {connect} from '@tarojs/redux';
import './index.scss';
import {ossUrl} from "../../../config";
import {getWindowHeight} from "../../../utils/style";

const img_close = ossUrl + 'wap/images/common/img_close.png'
const img_radio_normal = ossUrl + 'wap/images/common/img_radio_normal.png'
const img_radio_selected = ossUrl + 'wap/images/common/img_radio_selected.png'

@connect(({record}) => ({
  ...record,
}))
class recordMoveCat extends BaseComponent {
  config = {
    navigationBarTitleText: '新建档案袋',
  };

  constructor() {
    super(...arguments)
    this.state = {
      rid: '',
      cat_list: Taro.getStorageSync('store_cat_list'),
      selected_cat: [],//选中的档案袋id
    }
  }

  componentDidMount = () => {
    let rid = this.$router.params.rid;
    this.setState({rid: rid});

    this.state.cat_list.forEach((item) => {
      item.is_selected = false;
    })
  }

  //关闭按钮
  actionCloseImg = () => {
    //this.log('actionCloseImg');
    Taro.navigateBack();
  }

  //保存按钮
  actionSave = () => {
    //this.log('actionSave');
    if (this.state.name == '') {
      Taro.showToast({
        title: '请填写档案名称！',
        icon: 'none',
        mask: true,
      });
      return false;
    }
    if (this.state.avatar == '') {
      Taro.showToast({
        title: '请填选择档案背景！',
        icon: 'none',
        mask: true,
      });
      return false;
    }

    //组装cids
    let cids = '';
    this.state.cat_list.forEach((item) => {
      if (item.is_selected) {
        cids = item.id + '-';
      }
    })
    let lastChar = cids.charAt(cids.length - 1);
    if (lastChar == '-') {
      cids.substring(0, cids.length - 2);
    }
    this.log(cids);

    //保存数据
    this.props.dispatch({
      type: 'record/save',
      payload: {
        record_edit_or_delete_id: this.state.rid,
        record_move_cat_cid: cids,
      }
    });

    //请求数据
    this.props.dispatch({
      type: 'record/record_move_cat',
    });

  }

  //选中图片
  actionItemSelected = (e) => {
    let index = e.currentTarget.dataset.index;
    let cat_list = this.state.cat_list;
    let is_selected = cat_list[index].is_selected;
    cat_list[index].is_selected = !is_selected;
    this.setState({cat_list: cat_list});
  }


  render() {
    const {cat_list} = this.state;
    this.log('recordMoveCat render cat_list.length=' + cat_list.length);
    this.log(this.state.cat_list);

    return (
      <View className='record-move-cat-page'>
        {/*关闭按钮*/}
        <View className='top_container'>
          <View className='close_container' onClick={this.actionCloseImg}>
            <Image
              className='close_img'
              src={img_close}
            />
          </View>
          <View className='title'>
            选择档案袋
          </View>
          <View className='hint'>可多选</View>
        </View>

        {/*中间滑动部分*/}
        <ScrollView
          className='scroll-con'
          scrollY
          scrollWithAnimation
          scrollTop='0'
          style={'height:' + getWindowHeight(false, false, 0) + 'px'}
        >
          {
            cat_list && cat_list.length > 0 ? (
              <View className='cat-con'>
                {cat_list.map((item, index) => (
                  <View key={index} className='cat-item-con' data-index={index} onClick={this.actionItemSelected}>
                    <View className='cat-name'>{item.name}</View>
                    <Image
                      className='img-raido'
                      src={item.is_selected ? img_radio_selected : img_radio_normal}
                    />
                  </View>
                ))}
              </View>
            ) : (
              <View></View>
            )
          }
          <View className='bottom-con'></View>
        </ScrollView>

        {/*底部保存按钮*/}
        <View className='bottom_container'>
          <View className='btn' onClick={this.actionSave}>
            保存
          </View>
        </View>
      </View>
    );
  }

}

export default recordMoveCat;
