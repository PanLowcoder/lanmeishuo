import Taro from '@tarojs/taro';
import BaseComponent from "../../BaseComponent";
import { View, Image, ScrollView, Text } from '@tarojs/components';
import { AtProgress, AtRate } from 'taro-ui';
import PropTypes from 'prop-types';
import './index.less';
import CommonOpenCloseText from '../../CommonOpenCloseText'
import { ossUrl } from "../../../config";

const img_day_advice_rencent = ossUrl + 'upload/images/fortune/img_day_advice_rencent.png';
const img_day_words = ossUrl + 'upload/images/fortune/img_day_words.png';


/**
 * 日运详情组件
 */
class FortuneDayDetail extends BaseComponent {
  static propTypes = {
    detail: PropTypes.object,
    onFortuneNoteClick: PropTypes.func,
  }

  static defaultProps = {
    detail: '',
  };

  constructor() {
    super(...arguments)
    this.state = {
      astro_colors: ['#f8e71c', '#01f7ea', '#e2ecff'],//星象变动-内容-头部颜色
    }
  }

  componentDidMount = () => {
    //this.log('FortuneDayDetail componentDidMount ');
  };

  //底部运势日记 点击
  actionFortuneNote = () => {
    this.props.onFortuneNoteClick(this.props.detail.note_status)
  }


  render() {
    const { detail } = this.props;
    const { astro_colors } = this.state;

    return (
      <View className='day-detail-container'>
        {/*幸运色、方位、数字、星座 部分 部分*/}
        <ScrollView
          className='symbol-container'
          scrollX
          scrollWithAnimation
        >
          {/*单个元素 部分*/}
          {detail && detail.lucky_symbol && detail.lucky_symbol.length > 0 && detail.lucky_symbol.map((item) =>
            <View className='item-container'>
              <Image
                className='img'
                src={item.icon_url}
                onClick={this.actionCalendarImg}
              />
              <View className='title'>{item.name}</View>
            </View>
          )}
        </ScrollView>
        {/*运势概括、柱状图部分*/}
        <View className='chart-list-container'>
          {/*顶部标题部分*/}
          <View className='header-container'>
            <View className='title'>运势概况</View>
            <View className='des'>数值越高，则相关项发生事件的几率越高，不同颜色则代表好坏吉凶的程度不同。</View>
          </View>

          {/*柱状图部分*/}
          <ScrollView
            className='scroll-view-container'
            scrollX
            scrollWithAnimation
          >
            {/*单个元素 部分*/}
            {detail && detail.fortune_list && detail.fortune_list.length > 0 && detail.fortune_list.map((item) =>
              <View className='item-container'>
                <View className='top-container'>
                  <AtProgress
                    className='progress'
                    percent={item.score}
                    color={item.color}
                    isHidePercent
                  />
                  <View className='percent'>{Math.floor(item.score)}%</View>
                </View>
                <View className='bottom_title'>{item.name}</View>
              </View>
            )}
          </ScrollView>

        </View>

        {/*运势提点 部分*/}
        <View className='revive-day-container'>
          {/*顶部标题部分*/}
          <View className='header-container'>
            <View className='title'>运势提点</View>
            <View className='des'>预测无法涵盖所有情形，也不会绝对准确，请大家理性看待，适当参考。另外，预测事件很可能提前或错后一两天发生。</View>
          </View>
          {/* **之日列表 部分*/}
          <View className='list-container'>
            {/*单个元素 部分*/}
            {detail && detail.revive_day && detail.revive_day.length > 0 && detail.revive_day.map((item) =>
              <View className='item-container'>
                {/*标题&评分 和 内容 部分*/}
                <View className='day-container'>
                  <View className='title-and-rate-container'>
                    <Text className='day-title'>{item.name}</Text>
                    <AtRate
                      className='day-rate'
                      size='15'
                      max={3}
                      margin={10}
                      value={item.star_level}
                    />
                  </View>
                  <CommonOpenCloseText
                    des={item.tips}
                  />
                </View>
              </View>
            )}
          </View>
          {/*运势建议列表 部分*/}
          {detail.fortune_advice && detail.fortune_advice.length > 0 &&
            (<View className='adavice-list-container'>
              <View className='list-container'>
                {/*单个元素 部分*/}
                {detail && detail.fortune_advice && detail.fortune_advice.length > 0 && detail.fortune_advice.map((item, index) =>
                  <View className='item-container'>
                    {/*标题&评分 和 内容 部分*/}
                    <View className='advice-container'>
                      <View className='title-and-status-container'>
                        <View className='title'>{item.name}</View>
                        {/*[1=>今日,2=>近日]*/}
                        {item.status == 2 && (
                          // <Image
                          //   className='status_img'
                          //   src={img_day_advice_rencent}
                          // />
                          <View>11111</View>
                        )}
                      </View>
                      <View className='des'>{item.tips}</View>
                      {index != detail.fortune_advice.length - 1 && (<View className='sperate-line'></View>)}

                    </View>
                  </View>
                )}
              </View>
            </View>
            )
          }

          {/*星象变动列表 部分*/}
          <View className='astro-list-container'>
            <View className='list-container'>
              {/* <Image
              className='img'
              src={detail.astro_icon_url}
            /> */}
              {/*标题&内容 部分*/}
              <View className='container'>
                <View className='title'>{detail.astro_name}</View>
                {/*单个元素 部分*/}
                <View className='content-container'>

                  {detail && detail.astro_tips && detail.astro_tips.length > 0 && detail.astro_tips.map((item, index) =>
                    <View className='item-container'>
                      <View className='left' style={'background:' + astro_colors[index % 3]}></View>
                      <View className='right_des'>{item}</View>
                    </View>
                  )}
                </View>
              </View>
            </View>
          </View>
        </View>


        {/*女神赠言部分*/}
        <View className='word-contianer'>
          <View className='word'>{detail && detail.goddess_list && detail.goddess_list.tips}</View>
          <View
            className='from'
          >{detail && detail.goddess_list && detail.goddess_list.from != '' && '--- ' + detail.goddess_list.from}</View>
        </View>

        {/*[0=>没有笔记,1=>有笔记]*/}
        {detail && detail.hasOwnProperty('forbid_name') && (
          <View className='note-btn' onClick={this.actionFortuneNote}>{detail && detail.note_status == 0 ? '给你今天打个分' : '查看运势日记'}</View>
        )}
      </View>

    )
  }
}

export default FortuneDayDetail;
