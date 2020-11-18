import Taro from '@tarojs/taro';
import BaseComponent from "../../../components/BaseComponent";
import {View, Input, Image, ScrollView} from '@tarojs/components';
import {connect} from '@tarojs/redux';
import './index.scss';
import {ossUrl} from "../../../config";
import {getCat} from "../../../utils/common";
import {getWindowHeight} from "../../../utils/style";

const img_close = ossUrl + 'wap/images/common/img_close.png'
const img_radio_normal = ossUrl + 'wap/images/common/img_radio_normal.png'
const img_radio_selected = ossUrl + 'wap/images/common/img_radio_selected.png'

@connect(({record}) => ({
  ...record,
}))
class recordCatAdd extends BaseComponent {
  config = {
    navigationBarTitleText: '新建档案袋',
  };

  constructor() {
    super(...arguments)
    this.state = {
      type: 0,//类型：0：新增；1：编辑
      id: '',
      name: '',
      avatar: '',
    }
  }

  componentDidMount = () => {
    //this.log('recordCatAdd componentDidMount');
    let type = this.$router.params.type;
    let id = this.$router.params.id;
    this.setState({id: id, type: type});

    if (type == 1) {//编辑
      let cat = getCat(id);
      this.log(cat)
      if (cat) {
        this.setState({name: cat.name, avatar: cat.avatar});
      }
    } else {//新增

    }

    //获取档案袋背景列表
    this.props.dispatch({
      type: 'record/record_cat_list',
    });
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

    this.props.dispatch({
      type: 'record/save',
      payload: {
        record_edit_or_delete_id: this.state.id,
        record_cat_add_name: this.state.name,
        record_cat_add_avatar: this.state.avatar,
      }
    })

    if (this.state.type == 1) {//编辑
      //请求数据，编辑档案
      this.props.dispatch({
        type: 'record/record_cat_edit',
      });
    } else {
      //请求数据，保存档案
      this.props.dispatch({
        type: 'record/record_cat_add',
      });
    }
  }

  //选中图片
  actionItemSelected = (e) => {
    let avatar = e.currentTarget.dataset.url;
    //this.log('actionItemSelected avatar=' + avatar);
    //保存数据
    this.setState({avatar: avatar});
  }

  //档案名称输入，保存数据
  actionCatNameInput = (event) => {
    const value = event.target.value;
    //this.log('actionCatNameInput name=' + value);
    this.setState({name: value});
  }

  render() {
    const {record_cat_add_bg_list} = this.props;
    const {name, avatar} = this.state;
    this.log('recordCatAdd render name=' + name + ',avatar=' + avatar);
    return (
      <View className='record-cat-page'>
        {/*关闭按钮*/}
        <View className='top_container'>
          <View className='close_container' onClick={this.actionCloseImg}>
            <Image
              className='close_img'
              src={img_close}
            />
          </View>
          <View className='title'>
            新建档案袋
          </View>
        </View>

        {/*中间滑动部分*/}
        <ScrollView
          className='scrollview'
          scrollY
          scrollWithAnimation
          scrollTop='0'
          style={'height: ' + getWindowHeight(false, true, 150) + 'px;'}
        >
          {/*<View className='middle_container'>*/}
          <Input
            className='input'
            name='mobile'
            maxLength='10'
            placeholder='档案袋名称'
            onInput={this.actionCatNameInput}
            value={name}
          />
          <View className='hint'>选择档案袋背景</View>
          {/*背景列表*/}
          <View className='bg-list-container'>
            {
              record_cat_add_bg_list && record_cat_add_bg_list.length > 0 ? (
                <View className='cat-bg-ui'>
                  {
                    record_cat_add_bg_list.map((item, index) => (
                      <View key={index} className='bg-li'>
                        <View className='pos'>
                          <View className='img-container' data-url={item} onClick={this.actionItemSelected}>
                            {/*背景图片*/}
                            <Image
                              className='bg_img'
                              src={ossUrl + item}
                            />
                            {/*选中、未选中图片*/}
                            <Image
                              className='radio_img'
                              src={item == avatar ? img_radio_selected : img_radio_normal}
                            />
                          </View>
                        </View>
                      </View>
                    ))
                  }
                </View>
              ) : (
                <View></View>
              )
            }
          </View>
          {/*</View>*/}
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

export default recordCatAdd;
