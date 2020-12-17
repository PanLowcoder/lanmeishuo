import Taro from '@tarojs/taro';
import BaseComponent from "../../BaseComponent";
import { View, Image, Text } from '@tarojs/components';
import PropTypes from 'prop-types';
import './index.less';
import { ossUrl } from "../../../config";

const img_day_calendar = ossUrl + 'wap/images/fortune/img_day_calendar.png'


/**
 * 日运日历组件
 */
class FortuneDayCalendar extends BaseComponent {
  static propTypes = {
    year: PropTypes.number,
    month: PropTypes.number,
    list: PropTypes.array,//日期列表；
    time: PropTypes.array,//有运势日记的日期列表；
    onClickDay: PropTypes.func,
    onClickCalendarImg: PropTypes.func,
  }

  static defaultProps = {
    list: [],
  };

  constructor() {
    super(...arguments)
    this.state = {
      days: [],//显示的days列表
      current_day_index: 0,//当前选中的day 的index
      week_titles: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],//星期几的标示
    }
  }

  componentDidMount = () => {
    this.log('FortuneDayCalendar componentDidMount ');

    this.getDays(new Date());
    Taro.eventCenter.on('FortuneDayCalendar', this.eventRefresh);
  };

  eventRefresh = (now, list) => {
    // this.log('FortuneDayCalendar eventRefresh');
    this.getDays(now, list);
  }

  //根据点击的日前，计算7日数据，并且保存数据
  getDays(now, list) {
    let tmp_list = this.props.list;
    if (list) {
      tmp_list = list;
    }

    //获取当前日期的列表
    let start_date = new Date(now.getTime() - 86400000 * 3);
    let days = [];
    for (let i = 0; i < 7; i++) {
      let item = {};
      let date = new Date(start_date.getTime() + i * 86400000)
      let day = date.getDate();
      let week = date.getDay(); //获取当前星期X(0-6,0代表星期天)
      item.day = day;
      item.date = date;
      item.week = week;
      //检查是否当天
      if (Math.abs(new Date().getTime() - date.getTime()) < 8640000) {
        item.now = 1;
      } else {
        item.now = 0;
      }
      //解锁标示：0：未解锁；1：已解锁；2：已解锁，并且已经写了运势日记；
      item.unlock = 0;
      for (let y = 0; y < tmp_list.length; y++) {
        if (Number(day) == Number(tmp_list[y])) {
          item.unlock = 1;
          this.log(this.props.time)
          if (this.props.time.length > 0) {
            this.props.time.map((item_note_time) => {
              if (Number(day) == Number(item_note_time)) {
                item.unlock = 2;
              }
            });
          }
          break;
        }
      }
      this.log('item.unlock=' + item.unlock)

      days.push(item);
    }
    this.log(days);
    this.setState({ days: days });
  }

  //日期被点击
  onClickDay = (e) => {
    let current_day_index = e.currentTarget.dataset.index;
    this.setState({ current_day_index });
    //判断是否刷新页面
    let is_unlock = false;
    let fortune = this.props.list;
    for (let i = 0; i < fortune.length; i++) {
      if (this.state.days[current_day_index].date.getDate() == fortune[i]) {
        is_unlock = true;
      }
    }
    if (is_unlock) {//已经解锁，那么刷新日运日历
      this.getDays(this.state.days[current_day_index].date);
    }

    this.props.onClickDay(this.state.days[current_day_index].date);

  }

  //日历图标  点击
  actionCalendarImg = () => {
    //this.log('actionCalendarImg');
    this.props.onClickCalendarImg(this.state.days[this.state.current_day_index].date);
  }


  render() {
    const { year, month } = this.props;
    const { days, week_titles } = this.state;

    return (
      <View className='day-calendar-container'>

        {/*左侧日期、右侧日历图标 部分*/}
        <View className='top-container'>
          <View className='date-container'>
            {year}年{month}月
          </View>
        </View>

        {/*日期横向列表*/}
        <View className='list-container'>
          {days && days.length > 0 && days.map((item, index) =>
            <View className='item-container' data-index={index} onClick={this.onClickDay}>

              <View
                className={3 == index ? 'item-day item-day-selected' : (item.now == 0 ? 'item-day' : 'item-day item-day-color')}
              >{item.day}</View>
              <View
                className={3 == index ? 'item-week-num item-week-num-selected' : 'item-week-num'}
              >{week_titles[item.week]}</View>
            </View>
          )}
        </View>

      </View>

    )
  }
}

export default FortuneDayCalendar;
