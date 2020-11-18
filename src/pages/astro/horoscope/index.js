import Taro from '@tarojs/taro';
import BaseComponent from "../../../components/BaseComponent";
import {View, Image, Text, SwiperItem, Swiper} from '@tarojs/components';
import {actionNavBack, customTen, getNameFromRecord, getRecord, getSelfRecord} from "../../../utils/common";
import {connect} from '@tarojs/redux';
import './index.scss';
import {AtNavBar} from 'taro-ui';
import AstroRecordModal from "../../../components/Modal/AstroRecordModal";
import HoroscopeModal from "../../../components/Modal/HoroscopeModal";
import {ossUrl} from "../../../config";

const icon_horoscope_birthimg = ossUrl + 'wap/images/astro/horoscope/icon_horoscope_birthimg.png'
const icon_horoscope_dayun = ossUrl + 'wap/images/astro/horoscope/icon_horoscope_dayun.png'
const icon_horoscope_setting = ossUrl + 'wap/images/astro/horoscope/icon_horoscope_setting.png'
const icon_horoscope_startyun = ossUrl + 'wap/images/astro/horoscope/icon_horoscope_startyun.png'

@connect(({astro}) => ({
  ...astro,
}))
class horoscope extends BaseComponent {
  config = {
    navigationBarTitleText: '八字',
  };

  constructor() {
    super(...arguments)
    this.state = {
      rid: getSelfRecord().id,
      alert_status: -1,//-1：不显示；0：显示导航栏右上角弹出的alert；1：显示模式alert；
    }
  }

  componentDidUpdate = () => {
    //this.log('weekDetail componentDidUpdate ');
  }

  componentDidMount = () => {
    let rid = this.$router.params.rid;
    if (rid) {
      this.setState({rid})
    }
    //请求八字数据
    this.props.dispatch({
      type: 'astro/horoscope',
    });

  };

  //切换档案 按钮被点击
  actionNavRightBtnClick = () => {
    this.log('actionNavRightBtnClick');
    this.setState({alert_status: 0});
  }

  //设置按钮被点击
  actionSettingBtnClick = () => {
    this.log('actionSettingBtnClick');
    this.setState({alert_status: 1});
  }

  onClickAlertShadow = () => {
    this.log('onClickAlertShadow');
    this.setState({alert_status: -1});
  }

  onAlertCancleClick = (horoscope_time_type, horoscope_time_start) => {
    this.log('onAlertCancleClick');
    this.setState({alert_status: -1});
    //保存数据
    this.props.dispatch({
      type: 'astro/save',
      payload: {
        horoscope_time_type: horoscope_time_type,
        horoscope_time_start: horoscope_time_start
      }
    });
    //请求八字数据
    this.props.dispatch({
      type: 'astro/horoscope',
    });
  }

  //日辰初始或者时间变化监听 回调
  onTypeOrTimeChange = (index, id) => {
    this.log('onTypeOrTimeChange index=' + index + ',id=' + id);
    // 0：时间模式；1：日辰初始；
    // horoscope_time_type: '0',//时间模式：0：北京时间；1：真太阳时；
    //   horoscope_time_start: '0',//日辰初始：23：23点；0：24点；
    let horoscope_time_type = this.props.horoscope_time_type;
    let horoscope_time_start = this.props.horoscope_time_start;


    if (index == 0) {
      horoscope_time_type = id;
    } else if (index == 1) {
      horoscope_time_start = id;
    }
    this.props.dispatch({
      type: 'astro/save',
      payload: {
        horoscope_time_type: horoscope_time_type,
        horoscope_time_start: horoscope_time_start,
      }
    });
  }

  render() {
    const {horoscope_data} = this.props;
    const {alert_status, rid} = this.state;

    let horoscope_record;
    if (horoscope_data) {

      horoscope_record = getRecord(rid)

      //十神
      horoscope_data.shishen1.unshift('十神');
      //天干地支
      horoscope_data.bazi1 = [horoscope_data.bazi['1'], horoscope_data.bazi['2'], horoscope_data.bazi['3'], horoscope_data.bazi['4']];
      horoscope_data.bazi2 = [horoscope_data.bazi['5'], horoscope_data.bazi['6'], horoscope_data.bazi['7'], horoscope_data.bazi['8']];
      //藏干
      horoscope_data.canggan.unshift('藏干');
      //十神2
      horoscope_data.shishen2.unshift('十神');
      //节令部分
      horoscope_data.changsheng.unshift('节令');
      //纳音部分
      horoscope_data.nayin.unshift('纳音');
      //空亡部分
      horoscope_data.kongwang.unshift('空亡');
      if (process.env.TARO_ENV === 'h5') {
        //五行比例
        let wuxing = [];
        for (let key in horoscope_data.wuxing) {
          let item = {};
          item.value = horoscope_data.wuxing[key];
          item.name = key;
          wuxing.push(item);
        }
        horoscope_data.wuxing = wuxing;
      }

    } else {
      return
    }

    this.log('horoscope_record=')
    this.log(horoscope_record)

    return (
      <View className='horoscope-detail-page'>
        {/*导航栏*/}
        <AtNavBar
          className='nav'
          onClickLeftIcon={this.actionNavBack}
          onClickRgIconSt={this.actionNavRightBtnClick}
          color='#fff'
          leftIconType='chevron-left'
          rightFirstIconType='iconfont icon-address_more'
          title={getNameFromRecord(horoscope_record)}
          fixed
        />
        {/*档案标题部分*/}
        {horoscope_data && horoscope_record && (
          <View className='header-record-con'>
            <View className='left-con'>
              <Image
                className='img'
                src={icon_horoscope_birthimg}
              />
              <View className='time'>
                {horoscope_record.year}.{customTen(horoscope_record.month)}.{customTen(horoscope_record.day)} {customTen(horoscope_record.hour)}:{customTen(horoscope_record.minute)}
              </View>
            </View>
            {/*设置图标*/}
            <Image
              className='img'
              src={icon_horoscope_setting}
              onClick={this.actionSettingBtnClick}
            />
          </View>
        )}
        {horoscope_data && (
          <View className='detail-con'>
            <Swiper
              className='swiper-con'
              indicatorDots
              indicatorColor='#f0f0f0'
              indicatorActiveColor='#fff'
            >

              {/*第一页内容*/}
              <SwiperItem key={0}>
                <View className='first-con'>
                  {/*十神部分*/}
                  <View className='shishen-con'>
                    {horoscope_data.shishen1.map((item) => (
                      <View className='item-text'>{item}</View>
                    ))}
                  </View>
                  {/*天干地支部分*/}
                  <View className='bazi-con'>
                    <View className='item-text'>{horoscope_record.sex == 1 ? '男命' : '女命'}</View>
                    {horoscope_data.bazi1 && horoscope_data.bazi1.length > 0 && horoscope_data.bazi1.map((item, index) => (
                      <View className='ver-con'>
                        <View
                          className='item-bazi-text'
                          style={'color:' + this.getColorBaZi(item)}
                        >
                          {item}
                        </View>
                        <View
                          className='item-bazi-text'
                          style={'color:' + this.getColorBaZi(horoscope_data.bazi2[index])}
                        >
                          {horoscope_data.bazi2[index]}
                        </View>
                      </View>
                    ))}
                  </View>
                  {/*臧干部分*/}
                  <View className='canggan-con'>
                    {horoscope_data.canggan.map((item, index) => (
                      <View className='item-text'>
                        {index == 0 && (<Text>{item}</Text>)}
                        {index > 0 && item.length > 0 && (
                          <Text style={'color:' + this.getColorBaZi(item[0])}>{item[0]}</Text>
                        )}
                        {index > 0 && item.length > 1 && (
                          <Text style={'color:' + this.getColorBaZi(item[1])}>{item[1]}</Text>
                        )}
                        {index > 0 && item.length > 2 && (
                          <Text style={'color:' + this.getColorBaZi(item[2])}>{item[2]}</Text>
                        )}
                      </View>
                    ))}
                  </View>
                  {/*十神2部分*/}
                  <View className='shishen-con'>
                    {horoscope_data.shishen2.map((item) => (
                      <View className='item-text'>{item}</View>
                    ))}
                  </View>

                  {/*分割线部分*/}
                  <View className='sep-con'>
                    <View className='bg'></View>
                    <View className='line'></View>
                    <View className='bg'></View>
                  </View>

                  {/*节令部分*/}
                  <View className='shishen-con'>
                    {horoscope_data.changsheng.map((item) => (
                      <View className='item-text'>{item}</View>
                    ))}
                  </View>

                  {/*纳音部分*/}
                  <View className='shishen-con'>
                    {horoscope_data.nayin.map((item) => (
                      <View className='item-text'>{item}</View>
                    ))}
                  </View>

                  {/*空亡部分*/}
                  <View className='shishen-con'>
                    {horoscope_data.kongwang.map((item) => (
                      <View className='item-text'>{item}</View>
                    ))}
                  </View>

                  {/*格局部分*/}
                  <View className='geju-con'>
                    <View className='item-text'>格局</View>
                    <View className='line'></View>
                  </View>

                  {/*按钮*/}
                  <View className='geju-btn'>{horoscope_data.geju}</View>

                  {/*五行比例标题*/}
                  <View className='geju-con'>
                    <View className='item-text'>五行比例标</View>
                    <View className='line'></View>
                  </View>
                  <View className='wuxing-con'>
                    {horoscope_data.wuxing.map((item) => (
                      <View className='item-con'>
                        <View className='top-con'>
                          <View className='progress-con'>
                            <View
                              className='value-bg'
                              style={'height:' + Number(item.value) + 'px;' + 'background:linear-gradient(' + this.getStartColor(item.name) + ',' + this.getEndColor(item.name) + ');'}
                            ></View>
                          </View>
                          <View className='percent'>{item.value}%</View>
                        </View>
                        <View className='title'>{item.name}</View>
                      </View>
                    ))}
                  </View>

                </View>

              </SwiperItem>

              {/*第二页内容*/}
              <SwiperItem key={1}>
                <View className='second-con'>
                  {/*天干地支部分*/}
                  <View className='bazi-con'>
                    <View className='item-text'>{horoscope_record.sex == 1 ? '男命' : '女命'}</View>
                    {horoscope_data.bazi1 && horoscope_data.bazi1.length > 0 && horoscope_data.bazi1.map((item, index) => (
                      <View className='ver-con'>
                        <Text
                          className='item-bazi-text'
                          style={'color:' + this.getColorBaZi(item)}
                        >
                          {item}
                        </Text>
                        <Text
                          className='item-bazi-text'
                          style={'color:' + this.getColorBaZi(horoscope_data.bazi2[index])}
                        >
                          {horoscope_data.bazi2[index]}
                        </Text>
                      </View>
                    ))}
                  </View>

                  {/*分割线部分*/}
                  <View className='sep-con'>
                    <View className='bg'></View>
                    <View className='line'></View>
                    <View className='bg'></View>
                  </View>

                  {/*起运部分*/}
                  <View className='qiyun-con'>
                    <Image
                      className='img-qiyun'
                      src={icon_horoscope_startyun}
                    />
                    <View className='item-text'>起运</View>
                    <View className='qiyun-text'>{horoscope_data.start_time}</View>
                    <View className='qiyun-text'>{horoscope_data.start_year_old}岁</View>
                  </View>

                  {/*大运流年部分*/}
                  <View className='qiyun-con'>
                    <Image
                      className='img-qiyun'
                      src={icon_horoscope_dayun}
                    />
                    <View className='item-text'>大运流年</View>
                    <View className='line'></View>
                  </View>

                  {/*底部详情部分*/}
                  <View className='detail-con'>
                    {horoscope_data.dayun.map((item, index) => (
                      <View className='item-con'>
                        {item.map((item2) => (
                          <View className='item-text' style={'color:' + this.getColorDayun(horoscope_data.dayun.length, index, item2)}>
                            {item2.name}
                          </View>
                        ))}

                      </View>
                    ))}
                  </View>


                </View>
              </SwiperItem>
            </Swiper>
          </View>
        )}

        {/*编辑、添加..档案alert*/}
        <AstroRecordModal
          type={1}
          show={alert_status == 0}
          onClickAlertShadow={this.onClickAlertShadow}
        />

        {/*时间和日辰模式alert*/}
        <HoroscopeModal
          show={alert_status == 1}
          horoscope_time_type={this.props.horoscope_time_type}
          horoscope_time_start={this.props.horoscope_time_start}
          onAlertCancleClick={this.onAlertCancleClick}
          onTypeOrTimeChange={this.onTypeOrTimeChange}
        />
      </View>
    )
  }


  getColorBaZi(tianDi) {
    let tianganColor = '#000';
    if (tianDi == "甲" || tianDi == "乙" || tianDi == "寅" || tianDi == "卯" || tianDi == "木"
    ) {
      tianganColor = '#00a74c';
    } else if (tianDi == "丙" || tianDi == "丁" || tianDi == "巳" || tianDi == "午" || tianDi == "火") {
      tianganColor = '#e02414';
    } else if (tianDi == "戊" || tianDi == "己" || tianDi == "丑" || tianDi == "辰" || tianDi == "戌" || tianDi == "未" || tianDi == "土") {
      tianganColor = '#9b4e1f';
    } else if (tianDi == "庚" || tianDi == "辛" || tianDi == "申" || tianDi == "酉" || tianDi == "金") {
      tianganColor = '#f07e00';
    } else {
      tianganColor = '#0b4ed2';
    }
    return tianganColor;
    //子、丑、寅、卯、辰、巳、午、未、申、酉、戌、亥
    //水、土、木、木、土、火、火、土、金、金、土、水
  }

  getStartColor(text) {
    switch (text) {
      case "水":
        return '#ff30deec';
      case "金":
        return '#fffcdd33';
      case "火" :
        return '#fffe613c';
      case "木":
        return '#ff0fd18f';
      default:
        return '#ffa8a7d9';
    }
  }

  getEndColor(text) {
    switch (text) {
      case "水":
        return '#ff33b3f8';
      case "金":
        return '#fffeb316';
      case "火" :
        return '#ffff9e24';
      case "木":
        return '#ff00c689';
      default:
        return '#ff7176e7';
    }
  }

  getColorDayun(length, index, item) {
    if (index == 0 || index == 1 || index == length - 1) {
      if (item.status == -1) {
        return '#999999';
      } else if (item.status == 0) {
        return '#50bc9f';
      } else {
        return '#f89e34';
      }
    } else {
      if (item.status == -1) {
        return '#999999';
      } else if (item.status == 0) {
        return '#fff;background:#009c73;border-radius:20px;padding: 0 10px;';
      } else {
        return '#f89e34';
      }
    }
  }
}


export default horoscope;
