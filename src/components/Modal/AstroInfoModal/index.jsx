import Taro from '@tarojs/taro';
import BaseComponent from "../../BaseComponent";
import {View, Text, Image} from '@tarojs/components';
import PropTypes from 'prop-types';
import './index.scss';
import {getAscFromRecord, getRecord} from "../../../utils/common";
import {ossUrl} from "../../../config";

/**
 *  星盘导航栏标题-用户信息 - alert组件
 */
class AstroInfoModal extends BaseComponent {
  static propTypes = {
    type: PropTypes.number,//类型：0：星盘；1：合盘；
    rid: PropTypes.number,
    rid2: PropTypes.number,//另外一个档案id，当type=1时有效
    bottom_text: PropTypes.string,//最下面一行的文字描述
    show: PropTypes.bool,//是否显示alert
    onClickAlertShadow: PropTypes.func,//点击阴影部分
  }

  static defaultProps = {
    type: 0,
    show: 0,
  };

  constructor() {
    super(...arguments)
    this.state = {}
  }

  componentDidMount = () => {
  }

  componentDidUpdate = () => {

  }

  //合盘-底部编辑按钮 被点击
  actionEditBtnClick = (e) => {
    let index = e.currentTarget.dataset.index;
    this.log('actionEditBtnClick index=' + index);
    let rid = this.props.rid;
    if (1 == index && this.props.rid1) {
      rid = this.props.rid1;
    }
    Taro.navigateTo({url: '/pages/record/recordAdd/index?type=1&rid=' + rid})
  }

  //底部黑色透明背景被点击
  actionBgClick = () => {
    this.log('actionBgClick');
    this.props.onClickAlertShadow();
  }

  render() {
    const {
      type,
      rid,
      rid2,
      bottom_text,
      show,
    } = this.props;

    let record = '';
    if (rid) {
      record = getRecord(rid);
      this.log('record =')
    }

    let records = [];
    if (rid2) {
      let record2 = getRecord(rid2);
      records.push(record)
      records.push(record2)
    }

    this.log(record)
    if (!record)
      return

    this.log('AstroInfoModal render ')

    return (
      <View className='astro-info-con'>
        {show && rid && 0 == type && (
          <View className='astro-modal-con'>
            <View className='info-con'>
              <View>{record.sex == 1 ? '男' : '女'}</View>
              <View>{record.year} 年 {record.month} 月 {record.day} 日 {record.hour} 时 {record.minute} 分</View>
              <View>出生于&nbsp;&nbsp;&nbsp;{record.birth_country == record.birth_province ?
                (<Text className='text-dark'>{record.birth_country + ' ' + record.birth_city}</Text>) :
                (<Text className='text-dark'>{record.birth_country + ' ' + record.birth_province + ' ' + record.birth_city}</Text>)
              }
              </View>
              <View>E{record.long_deg}°{record.long_min}′ N{record.lat_deg}°{record.lat_min}′ </View>
              <View>现居地&nbsp;&nbsp;&nbsp;{record.live_country == record.live_province ?
                (<Text className='text-dark'>{record.live_country + ' ' + record.live_city}</Text>) :
                (<Text className='text-dark'>{record.live_country + ' ' + record.live_province + ' ' + record.live_city}</Text>)
              }
              </View>
              <View className='text-pink'>{getAscFromRecord(record)}</View>
              {bottom_text && (
                <View className='text-pink'>{bottom_text}</View>
              )}
            </View>
            <View
              className='info-shandow-con'
              onClick={this.actionBgClick}
            />
          </View>
        )}

        {show && rid && rid2 && 1 == type && (
          <View className='astro-modal-con  astro-synastry-modal-con'>
            {records.length == 2 && records.map((record_item, index) => (
              <View className='info-con info-synastry-add'>
                <View>{record_item.sex == '1' ? '男' : '女'}</View>
                <View>{record_item.year}年{record_item.month}月{record_item.day}日{record_item.hour}时{record_item.minute}分</View>
                <View>出生于&nbsp;&nbsp;&nbsp;{record_item.birth_country == record_item.birth_province ?
                  (<Text className='text-dark'>{record_item.birth_country + ' ' + record_item.birth_city}</Text>) :
                  (<Text
                    className='text-dark'
                  >{record_item.birth_country + ' ' + record_item.birth_province + ' ' + record_item.birth_city}</Text>)
                }
                </View>
                <View>E{record_item.long_deg}°{record_item.long_min}′ N{record_item.lat_deg}°{record_item.lat_min}′ </View>
                <View>现居地&nbsp;&nbsp;&nbsp;{record_item.live_country == record_item.live_province ?
                  (<Text className='text-dark'>{record_item.live_country + ' ' + record_item.live_city}</Text>) :
                  (<Text
                    className='text-dark'
                  >{record_item.live_country + ' ' + record_item.live_province + ' ' + record_item.live_city}</Text>)
                }
                </View>
                <View className='text-pink'>{getAscFromRecord(record_item)}</View>
                <View className='edit-con' data-index={index} onClick={this.actionEditBtnClick}>
                  <Image
                    className='img-edit'
                    src={ossUrl + 'wap/images/astro/img_record_edit.png'}
                  ></Image>
                  <View className='text-edit'>编辑</View>
                </View>
              </View>
            ))}

            <View
              className='info-shandow-con'
              onClick={this.actionBgClick}
            />
          </View>
        )}
      </View>
    );
  }
}

export default AstroInfoModal;
