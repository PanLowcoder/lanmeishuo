import Taro from '@tarojs/taro';
import BaseComponent from "../../../components/BaseComponent";
import './index.scss';
import {View, Image, Text, ScrollView} from '@tarojs/components';
import {AtTabs, AtNavBar, AtRate} from 'taro-ui';
import {CONS, PLANET} from '../../../utils/constants'
import {getNameFromRecord, getRecord, getSelfRecord} from "../../../utils/common";
import {connect} from '@tarojs/redux';

import PredicBarDetaiModal from '../../../components/Modal/PredicBarDetaiModal'
import {ossUrl} from "../../../config";
import {getWindowHeight} from "../../../utils/style";

const img_change = ossUrl + 'wap/images/astro/predict/img_change.png'
const icon_natal_home = ossUrl + 'wap/images/astro/predict/icon_natal_home.png'
const icon_natal_health = ossUrl + 'wap/images/astro/predict/icon_natal_health.png'
const icon_natal_love = ossUrl + 'wap/images/astro/predict/icon_natal_love.png'
const icon_natal_money = ossUrl + 'wap/images/astro/predict/icon_natal_money.png'
const icon_natal_study = ossUrl + 'wap/images/astro/predict/icon_natal_study.png'
const icon_natal_work = ossUrl + 'wap/images/astro/predict/icon_natal_work.png'


@connect(({astro}) => ({
  ...astro,
}))
class predict extends BaseComponent {
  config = {
    navigationBarTitleText: '本命预测',
  };

  constructor() {
    super(...arguments)
    this.state = {
      tabs: [
        {title: '人生概况'},
        {title: '行星能量'},
        {title: '星座成分'}
      ],
      tabsListValue: 0,//顶部tab栏，当前选中标识；
      alert_current_index: -1,
    }
  }

  componentDidUpdate = () => {
    //this.log('weekDetail componentDidUpdate ');
  }

  componentDidMount = () => {
    let predict_rid = this.$router.params.rid;
    let predict_record = {};
    if (!predict_rid) {
      predict_record = getSelfRecord();
    } else {
      predict_record = getRecord(predict_rid);
    }

    this.log(predict_record)
    // 保存数据
    this.props.dispatch({
      type: 'astro/save',
      payload: {
        predict_record: predict_record
      }
    });
    //请求本命预测数据
    this.props.dispatch({
      type: 'astro/get_predict_data',
    });
  }

  //点击tab栏
  handleTabsClick(stateName, value) {
    this.setState({
      [stateName]: value
    });
  }

  //点击list
  onClick() {
    //this.log(item)
  }

  //档案图片被点击
  actionConImg = () => {
    Taro.navigateBack();
  }

  actionChangeRecord = () => {
    this.log('actionChangeRecord');
  }

  actionScoreItem = (e) => {
    let index = e.currentTarget.dataset.index;
    this.log('actionScoreItem');
    this.setState({alert_current_index: index});

  }

  onAlertCancleClick = () => {
    this.setState({alert_current_index: -1});
  }

  //行星能量-单个item被点击
  actionItemPlanetClick = (e) => {
    let index = e.currentTarget.dataset.index;
    Taro.navigateTo({url: '/pages/astro/predictPlanetDetail/index?index=' + index});
  }

  render() {
    const {
      predict_record,
      predict_data,
    } = this.props;

    const {
      tabs,
      tabsListValue,
      alert_current_index,
      // predict_data
    } = this.state;

    let scores = [];
    if (predict_data) {
      this.log('predict_data !=null')
      scores = this.customScores(predict_data)
    } else {
      return;
    }

    return (
      <View className='predict-detail-page'>
        {/*导航栏*/}
        <AtNavBar
          className='nav'
          onClickLeftIcon={this.actionNavBack}
          color='#000'
          leftIconType='chevron-left'
          fixed
        />
        {/*顶部内容*/}
        <View className='top-container'>
          <View className='left-con' onClick={this.actionChangeRecord}>
            <View className='title'>
              {getNameFromRecord(predict_record)}
            </View>
            <Image
              className='img'
              src={img_change}
            />
          </View>
          <Image
            className='img-avatar'
            src={predict_record.avatar == '' ? CONS[(predict_record.sun.split('-')[0] - 1)].record_default_avatar : (ossUrl + predict_record.avatar)}
            onClick={this.actionConImg}
          />
        </View>

        {/*tab栏*/}
        <AtTabs
          className='tabs-con'
          swipeable={false}
          scroll
          current={tabsListValue}
          tabList={tabs}
          onClick={this.handleTabsClick.bind(this, 'tabsListValue')}
        >
        </AtTabs>

        <ScrollView
          className='scrollview'
          scrollY
          scrollWithAnimation
          scrollTop='0'
          style={'height: ' + getWindowHeight(false, false, 120) + 'px;'}
        >
          {tabsListValue == 0 && (
            <View className='pane-page-0'>
              <View className='top-con'>
                <View className='bg-circle'></View>
                <Text className='hint'>点击柱状图可查看得分意义；此打分尚未完善，仅供娱乐！</Text>
              </View>
              <View className='chart-con'>
                {scores && scores.length > 0 && scores.map((item, index) => (
                  <View className='item-con'>
                    <View className='con'>
                      <View className='score'>{item.score}</View>
                      <View className='progress-con' data-index={index} onClick={this.actionScoreItem}>
                        <View className='bg-top' style={'height:' + (300 - Number(item.score) * 0.6) + 'px'}></View>
                        <View
                          className={Number(item.score) < 400 ? 'bg-bottom' : 'bg-bottom-gradient'}
                          style={'height:' + Number(item.score) * 0.6 + 'px'}
                        />
                      </View>
                      <View className='title'>{item.title}</View>
                    </View>
                  </View>
                ))}
              </View>
            </View>
          )}

          {tabsListValue == 1 && (
            <View className='pane-page-1'>
              {predict_data && predict_data.planet_power && predict_data.planet_power.length > 0 && predict_data.planet_power.map((item, index) => (
                <View className='planet-item-con' data-index={index} onClick={this.actionItemPlanetClick}>
                  <Image className='img-planet' src={PLANET(item.id).predict_icon}></Image>
                  <View className='right-con'>
                    <View className='planet-top-con'>
                      <View className='text'>{PLANET(item.id).whole}</View>
                      <AtRate
                        className='rate'
                        size='15'
                        max={5}
                        value={item.lv}
                      />
                    </View>
                    <View className='bottom-des'>
                      {item.description}
                    </View>
                  </View>
                </View>
              ))}
            </View>
          )}

          {tabsListValue == 2 && (
            <View className='pane-page-2'>
              {predict_data && predict_data.sign_score && predict_data.sign_score.length > 0 && predict_data.sign_score.map((item, index) => (
                <View className='sign-item-con' data-index={index} onClick={this.actionItemPlanetClick}>
                  <Image className='img-sign' src={CONS[item.id].img}></Image>
                  <View className='sign-right-con'>
                    <View className='sign-top-con'>
                      <View className='left-con'>
                        <View className='text'>{CONS[item.id].name}</View>
                        <View className='sep'></View>
                        <View className='des'>{item.type}</View>
                        <View className='sep'></View>
                      </View>
                      <View className='percent-con'>
                        <View className='percent'>11{item.percent.toString().substring(2, 2)}</View>
                        <Text className='unit'>%</Text>
                      </View>
                    </View>
                    <View className='sign-bottom-con'>
                      <View className='bottom-des'>{item.tags[0]} {item.tags[1]} {item.tags[2]}</View>
                      <View className='progress-con'>
                        <View className='left-bg' style={'width:' + item.percent * 100 + 'px;'}>&nbsp;</View>
                      </View>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          )}

        </ScrollView>


        {/*预测得分柱状图点击的alert*/}
        <PredicBarDetaiModal
          show={alert_current_index != -1}
          item={scores[alert_current_index]}
          onAlertCancleClick={this.onAlertCancleClick}
        />

      </View>
    )
  }

  getPercent(percent) {
    this.log('percent=' + percent)
    return percent.toString().substring(2, 2);
  }

  //私有方法 处理得分数据
  customScores(predict_data) {
    let scores = [];
    if (predict_data) {
      let item = predict_data.total_power;
      let score = {};
      score.score = item.love;
      score.des = item.love_text;
      score.title = '婚恋';
      score.img = icon_natal_love;
      scores.push(score);

      score = {};
      score.score = item.home;
      score.des = item.home_text;
      score.title = '家庭';
      score.img = icon_natal_home;
      scores.push(score);

      score = {};
      score.score = item.work;
      score.des = item.work_text;
      score.title = '事业';
      score.img = icon_natal_work;
      scores.push(score);

      score = {};
      score.score = item.health;
      score.des = item.health_text;
      score.title = '健康';
      score.img = icon_natal_health;
      scores.push(score);

      score = {};
      score.score = item.money;
      score.des = item.money_text;
      score.title = '财富';
      score.img = icon_natal_money;
      scores.push(score);

      score = {};
      score.score = item.study;
      score.des = item.study_text;
      score.title = '学识';
      score.img = icon_natal_study;
      scores.push(score);

    }
    return scores;
  }
}

export default predict;
