import Taro from '@tarojs/taro';
import BaseComponent from "../../../components/BaseComponent";
import {ScrollView, View} from '@tarojs/components';
import './index.scss';
import {connect} from '@tarojs/redux';
import {AtIcon} from "taro-ui";
import {getNameFromRecord, getRecord} from "../../../utils/common";

import AstroRecordModal from '../../../components/Modal/AstroRecordModal'
import TabHeaderView from '../../../components/Astro/TabHeaderView'
import BottomView from '../../../components/Astro/BottomView'
import CanvasView from '../../../components/Astro/CanvasView';
import { ASTRO_SYNASTRY_TYPES, BOTTOM_LETF_BTN_TYPE } from '../../../utils/astrolabe';
import AstroTypeModal from '../../../components/Modal/AstroTypeModal'
import AstroInfoModal from "../../../components/Modal/AstroInfoModal"
import {getWindowHeight} from "../../../utils/style";
import BottomTimeView from "../../../components/Astro/BottomTimeView";
import SynastryBottomView from "../../../components/Astro/SynastryBottomView";


/**
 * 本页弹出的alert详情
 * @type {{ASTRO_STYLE: number, RECORD_MORE: number, INFO: number}}
 */
export const ALERT_TYPES = {
  RECORD_MORE: 0,//导航栏右上角弹出的alert；
  ASTRO_STYLE: 1,//显示星盘样式alert；
  INFO: 2,//导航栏标题点击个人信息详情alert
}

@connect(({astro, common}) => ({
  ...astro, ...common
}))
class synastryAstro extends BaseComponent {
  config = {
    navigationBarTitleText: '合盘',
  };

  constructor() {
    super(...arguments)
    this.state = {
      alert_status: -1,//-1：不显示；
      type_index: 0,
      bg_index: 0,//默认的风格
      style_index: 0,
      time_sep_index: 0,//底部时间间隔列表的index
    }
  }

  componentDidShow = () => {
    this.log('astro synastryAstro componentDidShow by mark');
    if (this.props.is_refresh_astro) {//刷新星盘数据
      this.log('刷新星盘数据')
      this.props.dispatch({
        type: 'astro/get_synastry_astro_data',
      })
      this.props.dispatch({
        type: 'astro/save',
        payload: {
          is_refresh_astro: false
        }
      })
    }
  }

  componentDidMount = () => {
    let rid1 = this.$router.params.rid1;
    let rid2 = this.$router.params.rid2;
    let index = this.$router.params.index;

    if (!rid1 || !rid2) {
      return;
    }


    if (!index) {//默认显示的星盘
      index = ASTRO_SYNASTRY_TYPES.SYNASTRY_1;
    }

    this.props.dispatch({
      type: 'astro/save',
      payload: {
        synastry_rid1: rid1,
        synastry_rid2: rid2,
        synastry_tab_index: index,
        data: '',
      }
    });

    //请求本命数据
    this.props.dispatch({
      type: 'astro/get_synastry_astro_data'
    });

  }

  //导航栏返回按钮被点击
  actionNavBack = () => {
    this.log('synastryAstro actionNavBack')
    this.log(Taro.getCurrentPages())
    //刷新星盘数据
    this.props.dispatch({
      type: 'astro/save',
      payload: {
        is_refresh_astro: true
      }
    })
    Taro.navigateBack();
  }

  //导航栏右侧按钮被点击
  actionNavRightBtnClick = () => {
    this.log('actionNavRightBtnClick');
    this.setState({alert_status: ALERT_TYPES.RECORD_MORE});
  }

  //导航栏标题被点击
  actionNavTitleClick = () => {
    this.log('actionNavTitleClick')
    this.setState({alert_status: ALERT_TYPES.INFO});
  }

  //顶部星盘tab切换方法
  onTabHeaderSeleted = (index) => {
    this.log('onTabHeaderSeleted index=' + index);
    this.props.dispatch({
      type: 'astro/save',
      payload: {
        synastry_tab_index: index,
        data: '',
      }
    });
    //请求星盘数据
    this.props.dispatch({
      type: 'astro/get_synastry_astro_data'
    });
  }

  //通用的黑色透明背景点击事件
  onAlertCancleClick = () => {
    this.log('onAlertCancleClick');
    this.setState({alert_status: -1});
  }

  //点击星盘样式按钮，回调
  onStyleBtnClick = () => {
    this.log('onStyleBtnClick');
    this.setState({alert_status: ALERT_TYPES.ASTRO_STYLE});
  }

  //星盘类型切换（现代、古典、特殊）
  onTidChangeClick = (tid) => {
    this.props.dispatch({
      type: 'astro/save',
      payload: {tid}
    })

    //请求星盘数据
    this.props.dispatch({
      type: 'astro/get_synastry_astro_data'
    })
  }

  //星盘样式、风格、类型修改
  onTypeClick = (index, id) => {
    this.log('onTypeClick index=' + index + ',id=' + id);
    //onTypeClick: PropTypes.func,//星盘样式切换，0：星盘样式；1：星盘风格；2：星盘类型；
    if (index == 0) {
      this.setState({type_index: id})
    } else if (index == 1) {
      this.setState({bg_index: id})
    } else if (index == 2) {
      this.setState({style_index: id})
    }
  }

  //底部时间变化监听
  onTimeChange = (date, time) => {
    this.log('onTimeChange date' + date + ',time=' + time)
    this.props.dispatch({
      type: 'astro/save',
      payload: {
        date,
        time,
        data: '',
      }
    });

    //请求本命数据
    this.props.dispatch({
      type: 'astro/get_synastry_astro_data'
    });
  }

  //时间间隔切换
  onTimeSepChange = (time_sep_index) => {
    this.setState({time_sep_index})
  }

  render() {
    const {
      synastry_tab_index,
      tid,
      date,
      time,
      synastry_rid1,
      synastry_rid2,
      synastry_data,
    } = this.props;
    const {
      alert_status,
      type_index,
      bg_index,
      style_index,
      time_sep_index,
    } = this.state;

    this.log('astro synastryAstro render date=' + date + ',time=' + time + ',data=')
    let data = synastry_data
    this.log(data)

    let btn_type = BOTTOM_LETF_BTN_TYPE.NONE;// 左下角按钮的类型：-1：不显示；0：显示参数；1：显示单盘；2：显示双盘；
    if (ASTRO_SYNASTRY_TYPES.NATAL_1 == synastry_tab_index || ASTRO_SYNASTRY_TYPES.NATAL_2 == synastry_tab_index) {
      btn_type = BOTTOM_LETF_BTN_TYPE.PARAMS;
    }

    this.log('astro synastryAstro page render ');

    if (!synastry_rid1 || !synastry_rid2)
      return

    let record1 = getRecord(synastry_rid1)
    let record2 = getRecord(synastry_rid2)

    return (
      <View className='astro-page'>
        {/*导航栏*/}
        <View className='nav-con'>
          <AtIcon
            onClick={this.actionNavBack}
            value='chevron-left'
            className='nav-back'
          />
          <View
            className='title-con'
            onClick={this.actionNavTitleClick}
          >
            <View className='text-title'>{getNameFromRecord(record1)}+{getNameFromRecord(record2)}</View>
            <AtIcon
              value='iconfont icon-arrow-down'
              className='nav-back'
            />
          </View>
          <AtIcon
            onClick={this.actionNavRightBtnClick}
            value='iconfont icon-gengduo'
            className='nav-back'
          />
        </View>

        <TabHeaderView
          type={1}
          tab_index={synastry_tab_index}
          onTabHeaderSeleted={this.onTabHeaderSeleted}
        />
        <ScrollView
          className='scrollview'
          scrollY
          scrollWithAnimation
          scrollTop='0'
          style={'height: ' + getWindowHeight(false, true, 50) + 'px;'}
          lowerThreshold='20'
          onScrollToLower={this.onScrollToLower}
        >
          {/*中间星盘和按钮部分*/}
          {data && (
            <CanvasView
              type={1}
              rid={synastry_rid1}
              rid2={synastry_rid2}
              astro_type={synastry_tab_index}
              is_show_note_btn={1}
              tid={tid}
              btn_type={btn_type}
              astro_type_index={type_index}
              astro_bg_index={bg_index}
              astro_style_index={style_index}
              data={data}
              onStyleBtnClick={this.onStyleBtnClick}
              onTidChangeClick={this.onTidChangeClick}
              onSingleOrDoubleBtnClick={this.onSingleOrDoubleBtnClick}
            />
          )}

          {/*本命1和本命2底部内容*/}
          {(
            ASTRO_SYNASTRY_TYPES.NATAL_1 == synastry_tab_index ||
            ASTRO_SYNASTRY_TYPES.NATAL_2 == synastry_tab_index
          ) && data && (
            <BottomView
              rid={ASTRO_SYNASTRY_TYPES.NATAL_2 == synastry_tab_index ? synastry_rid2 : synastry_rid1}
            />
          )}

          {/*底部时间*/}
          {(
            ASTRO_SYNASTRY_TYPES.SYNASTRY_THIRDPROGRESSED_1 == synastry_tab_index ||
            ASTRO_SYNASTRY_TYPES.SYNASTRY_THIRDPROGRESSED_2 == synastry_tab_index ||
            ASTRO_SYNASTRY_TYPES.SYNASTRY_PROGRESSIONS_1 == synastry_tab_index ||
            ASTRO_SYNASTRY_TYPES.SYNASTRY_PROGRESSIONS_2 == synastry_tab_index ||
            ASTRO_SYNASTRY_TYPES.COMPOSITE_THIRDPROGRESSED == synastry_tab_index ||
            ASTRO_SYNASTRY_TYPES.COMPOSITE_PROGRESSIONS == synastry_tab_index ||
            ASTRO_SYNASTRY_TYPES.DAVISON_THIRDPROGRESSED == synastry_tab_index ||
            ASTRO_SYNASTRY_TYPES.DAVISON_PROGRESSIONS == synastry_tab_index
          ) && data && date && time && (
            <BottomTimeView
              date={date}
              time={time}
              sep_index={time_sep_index}
              onTimeChange={this.onTimeChange}
              onTimeSepChange={this.onTimeSepChange}
            />
          )}

          {/*底部的 *in* 以及 合盘详情 按钮*/}
          {(
            ASTRO_SYNASTRY_TYPES.SYNASTRY_1 == synastry_tab_index ||
            ASTRO_SYNASTRY_TYPES.SYNASTRY_2 == synastry_tab_index ||
            ASTRO_SYNASTRY_TYPES.COMPOSITE == synastry_tab_index ||
            ASTRO_SYNASTRY_TYPES.DAVISON == synastry_tab_index ||
            ASTRO_SYNASTRY_TYPES.MARKS_1 == synastry_tab_index ||
            ASTRO_SYNASTRY_TYPES.MARKS_2 == synastry_tab_index
          ) && data && (
            <SynastryBottomView
              record1={record1}
              record2={record2}
              astro_synastry_type={synastry_tab_index}
            />
          )}

        </ScrollView>


        {/*导航栏点击标题信息详情alert*/}
        <AstroInfoModal
          type={1}
          rid={synastry_rid1}
          rid2={synastry_rid2}
          show={alert_status == ALERT_TYPES.INFO}
          onClickAlertShadow={this.onAlertCancleClick}
        />


        {/*编辑、添加..档案alert*/}
        <AstroRecordModal
          type={2}
          show={alert_status == ALERT_TYPES.RECORD_MORE}
          onClickAlertShadow={this.onAlertCancleClick}
        />

        {/*星盘样式alert*/}
        <AstroTypeModal
          show={alert_status == ALERT_TYPES.ASTRO_STYLE}
          type={type_index}
          bg={bg_index}
          style={style_index}
          onAlertCancleClick={this.onAlertCancleClick}
          onTypeClick={this.onTypeClick}
        />

      </View>
    )
  }
}

export default synastryAstro;
