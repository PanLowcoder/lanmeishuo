import Taro from '@tarojs/taro';
import BaseComponent from "../../../components/BaseComponent";
import {View, Input, Image} from '@tarojs/components';
import './index.scss';

import img_back from '../../../images/common/img_back.png'
import {connect} from "@tarojs/redux";
import {showToast} from "../../../utils/common";

@connect(({record}) => ({
  ...record,
}))
class recordNameAndTagAdd extends BaseComponent {
  config = {
    navigationBarTitleText: '姓名/标签',
  };

  constructor() {
    super(...arguments)
    this.state = {
      type: 0,//只有2有用，2为 只可以选中自己
      name: '',//档案名称
      tag: '朋友',//选中的标签
      tag_list: ['自己', '恋人', '朋友', '亲友', '工作', '客户', '案例', '其他'],//tag列表
    }
  }

  componentDidMount = () => {
    let type = this.$router.params.type;
    // type = 2; //test
    if (type == 2) {
      this.setState({tag: '自己'})
    }
    this.setState({tag: this.props.record_add_tag, name: this.props.record_add_name, type});
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
      showToast('请填写档案名称！')
      return false;
    }
    if (this.state.tag == '' && this.state.type != 2) {
      showToast('请填选择Ta与您的关系！')
      return false;
    }
    let name = this.state.name;
    let tag = this.state.tag;

    this.props.dispatch({
        type: 'record/save',
        payload: {
          record_add_name: name,
          record_add_tag: this.state.type == 2 ? '自己' : tag,
        }
      }
    );
    Taro.navigateBack();
  }

  //标签点击事件
  actionTag = (e) => {
    let tag = e.currentTarget.dataset.tag;
    if (this.state.type != 2) {
      this.setState({tag: tag})
    } else {
      this.setState({tag: '自己'})
    }
  }

  //档案名称输入，保存数据
  actionNameInput = (event) => {
    const value = event.target.value;
    this.setState({
      name: value
    })
  }


  render() {
    const {type, tag, tag_list, name} = this.state;
    return (
      <View className='record-cat-page'>
        {/*关闭按钮*/}
        <View className='top_container'>
          <View className='close_container' onClick={this.actionCloseImg}>
            <Image
              className='close_img'
              src={img_back}
            />
          </View>
          <View className='save' onClick={this.actionSave}>
            保存
          </View>
        </View>
        {/*中间滑动部分*/}
        <View className='middle_container'>
          <View className='title'>
            姓名/标签
          </View>
          <Input
            className='input'
            name='mobile'
            maxLength='10'
            placeholder='档案名称'
            onInput={this.actionNameInput}
            value={name}
          />
          <View className='hint'>Ta与您的关系</View>
          {/*背景列表*/}
          <View className='bg-list-container'>
            {
              tag_list && tag_list.length > 0 ? (
                <View className='cat-bg-ui'>
                  {
                    tag_list.map((item, index) => (
                      <View key={index} className='bg-li'>
                        <View className='pos'>
                          <View className='img-container' data-url={item} onClick={this.actionItemSelected}>
                            {index == 0 ?
                              (
                                <View data-tag={item} className={type == 2 ? 'name selected' : 'name unable'}>{item}</View>
                              ) :
                              (
                                <View
                                  data-tag={item}
                                  className={type == 2 ? 'name unable' : (tag == item ? 'name selected' : 'name')}
                                  onClick={this.actionTag}
                                >{item}</View>
                              )}

                          </View>
                        </View>
                        {/*<Text>{item.introduction}</Text>*/}
                      </View>
                    ))
                  }
                </View>
              ) : (
                <View></View>
              )
            }
          </View>
        </View>

      </View>
    );
  }
}

export default recordNameAndTagAdd;
