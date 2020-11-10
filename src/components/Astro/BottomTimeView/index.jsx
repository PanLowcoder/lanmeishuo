import Taro from '@tarojs/taro';
import BaseComponent from "../../BaseComponent";
import {View, Picker} from '@tarojs/components';
import './index.scss';
import {customTen, getSepTimeFromStr} from "../../../utils/common";
import {AtActionSheet, AtActionSheetItem, AtIcon} from "taro-ui";
import PropTypes from "prop-types";


const SEP_TIMES = [
  '一小时',
  '一天',
  '一周',
  '一月',
  '一年',
]

/**
 *  星盘-底部时间 组件
 */
class BottomTimeView extends BaseComponent {
  static propTypes = {
    date: PropTypes.string,//传过来的时间（例如：2019-05-21）
    time: PropTypes.string,//传过来的时间（例如：10：30）
    sep_index: PropTypes.number,//选中的第几个时间分隔
    onTimeChange: PropTypes.func,//时间变化回调函数
    onTimeSepChange: PropTypes.func,//时间间隔改变回调函数
  }

  static defaultProps = {
    sep_index: 0,
  };

  constructor() {
    super(...arguments)
    this.state = {
      is_show_sep_actionsheet: false,
    }
  }

  componentDidMount = () => {

  }

  componentDidUpdate = () => {
  }

  componentWillReceiveProps() {
    this.log('BottomTimeView componentWillReceiveProps')
  }

  //分隔多长时间 被点击
  actionSepBtnClick = () => {
    this.log('actionSepBtnClick')
    this.setState({is_show_sep_actionsheet: true})
  }

  //间隔*时间，actionsheet item 被点击
  actionSheetItemClick(index) {
    this.log('actionSheetItemClick index=' + index)
    this.setState({is_show_sep_actionsheet: false})
    this.props.onTimeSepChange(index)
  }

  //日期picker改变监听
  onPickerDateChange = (e) => {
    this.log('onPickerDateChange value=' + e.detail.value);
    let arr = e.detail.value.split('-');
    this.props.onTimeChange(arr[0] + '-' + customTen(arr[1]) + '-' + customTen(arr[2]), this.props.time);
  }

  //时间picker改变监听
  onPickerTimeChange = (e) => {
    this.log('onPickerTimeChange value=' + e.detail.value);
    this.setState({time: e.detail.value})
    this.props.onTimeChange(this.props.date, e.detail.value);
  }

  //左侧按钮被点击
  actionLeftIconClick = () => {
    this.log('actionLeftIconClick date=' + this.props.date + ',time=' + this.props.time)
    let date_str = getSepTimeFromStr(this.props.date + ' ' + this.props.time, -this.props.sep_index - 1)
    this.log(date_str)
    let arr = date_str.split(' ')
    this.props.onTimeChange(arr[0], arr[1])
  }

  //右侧按钮被点击
  actionRightIconClick = () => {
    this.log('actionRightIconClick date=' + this.props.date + ',time=' + this.props.time)
    let date_str = getSepTimeFromStr(this.props.date + ' ' + this.props.time, this.props.sep_index + 1)
    this.log(date_str)
    let arr = date_str.split(' ')
    this.props.onTimeChange(arr[0], arr[1])
  }

  render() {
    const {
      is_show_sep_actionsheet,
    } = this.state;
    const {
      date,
      time,
      sep_index,
    } = this.props;

    this.log('BottomTimeView render date=' + date + ',time=' + time)

    if (!date || !time)
      return

    return (
      <View className='bottom-time-con'>
        <AtIcon
          data-type={0}
          onClick={this.actionLeftIconClick}
          value='chevron-left'
          className='icon-left'
        />
        {/*出生日期*/}
        <Picker
          mode='date'
          start='1900-01-01'
          end='2049-12-31'
          value={date}
          onChange={this.onPickerDateChange}
        >
          <View className='common-item-con' index={0}>{date}</View>
        </Picker>
        {/*出生时间*/}
        <Picker
          mode='time'
          value={time}
          onChange={this.onPickerTimeChange}
        >
          <View className='common-item-con' index={1}>{time}</View>
        </Picker>
        {/*间隔时间*/}
        <View className='common-item-con' onClick={this.actionSepBtnClick}>间隔{SEP_TIMES[sep_index]}</View>
        <AtIcon
          data-type={1}
          onClick={this.actionRightIconClick}
          value='chevron-left'
          className='icon-right'
        />

        {/*actionSheet*/}
        <AtActionSheet
          isOpened={is_show_sep_actionsheet}
          cancelText='取消'
        >
          {SEP_TIMES.map((item, index) => (
            <AtActionSheetItem
              data-index={index}
              onClick={this.actionSheetItemClick.bind(this, index)}
            >
              {item}
            </AtActionSheetItem>
          ))}
        </AtActionSheet>

      </View>
    )
  }
}

export default BottomTimeView;
