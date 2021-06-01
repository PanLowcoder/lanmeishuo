import Taro from '@tarojs/taro';
import BaseComponent from "../BaseComponent";
import {View, Text, Image, ScrollView} from '@tarojs/components';
import {AtSwipeAction} from "taro-ui"
import PropTypes from 'prop-types';
import {ossUrl} from "../../config";
import './index.scss';
import {connect} from "@tarojs/redux";
import {getWindowHeight} from "../../utils/style";
import CommonErrorOrEmptyHint from "../CommonErrorOrEmptyHint";
import {goToCommonPage} from "../../utils/common";
import {PAGES} from "../../utils/constants";

/**
 * 档案袋列表组件
 */
@connect(({record}) => ({
  ...record,
}))
class CatList extends BaseComponent {
  static propTypes = {
    type: PropTypes.number,
    cat_list: PropTypes.array,
  }

  static defaultProps = {};

  constructor() {
    super(...arguments)
    this.state = {}
  }

  componentWillReceiveProps = () => {
  }

  actionItemClick = (e) => {
    let id = e.currentTarget.dataset.id;
    goToCommonPage(PAGES.PAGE_CAT_RECORDS, '?cid=' + id + '&type='+this.props.type);
  }

  //侧滑打开（完全打开时触发）
  actionItemSwiperOpened = () => {
    this.log('actionItemSwiperOpened');
  }

  //侧滑关闭（完全关闭时触发）
  actionItemSwiperClosed = () => {
    this.log('actionItemSwiperClosed');
  }

  actionSwiperItemClick = (option) => {
    this.log('actionSwiperItemClick')
    this.log(option);
    if (option.text == '编辑') {
      this.log('edit')
      Taro.navigateTo({url: '/pages/record/recordCatAdd/index?type=1&id=' + option.id})
    } else if (option.text == '删除') {
      this.log('delete')
      Taro.showModal({
        content: '确定要删除此档案袋吗？',
        cancelText: '取消',
        confirmText: '确定',
        confirmColor: '#FF6C89'
      }).then(res => {
        if (res.confirm) {
          this.props.dispatch({
            type: 'record/save',
            payload: {
              record_edit_or_delete_id: option.id
            }
          });
          this.props.dispatch({
            type: 'record/record_cat_delete'
          });
        }
      });
    }

  }


  render() {
    const {cat_list} = this.props;
    // this.log('CatList render ' + cat_list.length);
    return (
      <View className='cat-list-con'>
        {(cat_list.length > 0) ? (
          <ScrollView
            className='cats-scroll-view'
            scrollY
            scrollWithAnimation
            scrollTop='0'
            style={'height:' + getWindowHeight(true, true) + 'px'}
          >

            {cat_list.length > 0 && cat_list.map((item, index) => (
              <View  className='item-con' data-id={item.id}>
                <AtSwipeAction
                  data-id={item.id}
                  autoClose
                  onOpened={this.actionItemSwiperOpened}
                  onClosed={this.actionItemSwiperClosed}
                  onClick={this.actionSwiperItemClick}
                  options={[
                    {
                      text: '编辑',
                      id: item.id,
                      style: {
                        backgroundColor: '#FF4949'
                      }
                    },
                    {
                      text: '删除',
                      id: item.id,
                      style: {
                        backgroundColor: '#6190E8'
                      }
                    }
                  ]}
                >
                  <View className='item_container' data-id={item.id} onClick={this.actionItemClick}>
                    <Image
                      className='img_bg'
                      src={ossUrl + `${item.avatar}`}
                    />
                    <View className='top_container'>
                      <View className='count_view'>
                        <Text className='count_text'>{item.count}</Text>
                        <Text className='unit_text'>人</Text>
                      </View>
                      <Text className='seperate_line'></Text>
                      <Text className='name'>{item.name}</Text>
                    </View>
                  </View>
                </AtSwipeAction>
              </View>
            ))}
            <View className='bottom-con'></View>
          </ScrollView>
        ) : (
          //无数据
          <CommonErrorOrEmptyHint
            des='您还没有档案袋，点击右上角新建档案袋~'
          />
        )
        }
      </View>
    );
  }
}

export default CatList;
