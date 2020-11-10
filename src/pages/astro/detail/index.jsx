import Taro from '@tarojs/taro';
import BaseComponent from "../../../components/BaseComponent";
import {ScrollView, View} from '@tarojs/components';
import './index.scss';
import {connect} from '@tarojs/redux';
import {AtIcon} from "taro-ui";
import {
  convertDateFromString,
  customTime,
  getNameFromRecord,
  getRecord,
  getSelfRecord,
  goToCommonPage,
  isEmpty
} from "../../../utils/common";

import AstroRecordModal from '../../../components/Modal/AstroRecordModal'
import TabHeaderView from '../../../components/Astro/TabHeaderView'
import BottomView from '../../../components/Astro/BottomView'
import {CanvasView,ASTRO_TYPES, BOTTOM_LETF_BTN_TYPE} from '../../../components/Astro/CanvasView'
import AstroTypeModal from '../../../components/Modal/AstroTypeModal'
import AstroInfoModal from "../../../components/Modal/AstroInfoModal"
import {getWindowHeight} from "../../../utils/style";
import BottomTimeView from "../../../components/Astro/BottomTimeView";
import {PAGES} from "../../../utils/constants";
import {RECORD_SELECT_TYPES} from "../../record/recordSelect";


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
class detail extends BaseComponent {
  config = {
    navigationBarTitleText: '星盘',
  };

  constructor() {
    super(...arguments)
    this.state = {
      alert_status: -1,//-1：不显示；
      type_index: 0,//星盘的样式-【0：中文；1：图标】
      bg_index: 0,//默认的风格，六种颜色
      style_index: 0,//星盘的类型-【0：经典；TODO  1：专业（待做）】
      time_sep_index: 0,//底部时间间隔列表的index
    }
  }

  componentDidShow = () => {
    this.log('astro detail componentDidShow by mark');
    //单选档案
    if (this.props.selected_records && this.props.selected_records.length == 1) {
      let rid = this.props.selected_records[0].id;
      this.props.dispatch({
        type: 'astro/save',
        payload: {
          rid: rid,
        }
      });

      //请求本命数据
      this.props.dispatch({
        type: 'astro/get_astro_data'
      });
      //请求笔记数量数据
      this.props.dispatch({
        type: 'astro/get_note_count'
      });
      //保存当前选择的档案
      this.props.dispatch({
        type: 'common/save',
        payload: {
          selected_records: this.props.selected_records,
        }
      });
    } else if (this.props.selected_records && this.props.selected_records.length == 2) {//合盘-多选档案
      let rid1 = this.props.selected_records[0].id;
      let rid2 = this.props.selected_records[1].id;
      this.log('rid1=' + rid1 + ',rid2=' + rid2)

      // this.props.dispatch({
      //   type: 'astro/save',
      //   payload: {
      //     data: '',
      //   }
      // })
      //保存当前选择的档案
      this.props.dispatch({
        type: 'common/save',
        payload: {
          selected_records: []
        }
      });
      this.log('astro ---------componentDidShow===合盘-多选档案')
      Taro.navigateTo({url: '/pages/astro/synastryAstro/index?rid1=' + rid1 + '&rid2=' + rid2})
    }


    if (this.props.is_refresh_astro) {//刷新星盘数据
      this.props.dispatch({
        type: 'astro/get_astro_data'
      })
      let rid = this.props.rid
      this.props.dispatch({
        type: 'astro/save',
        payload: {
          is_refresh_astro: false,
          rid,
        }
      })
    }

    //请求笔记数量数据
    this.props.dispatch({
      type: 'astro/get_note_count'
    });

  }

  componentDidMount = () => {

    let rid = this.$router.params.rid;
    let index = this.$router.params.index;
    if (!rid) {
      rid = getSelfRecord().id;
    }

    if (!index) {//默认显示的星盘
      index = ASTRO_TYPES.NATAL;
    }

    let date = this.$router.params.date
    let time = this.$router.params.time

    this.log('astro detail componentDidMount rid=' + rid + ',index=' + index + ',date=' + date + ',time=' + time)
    this.props.dispatch({
      type: 'astro/save',
      payload: {
        rid: rid,
        tab_index: index,
        date: (isEmpty(date) ? customTime(new Date(), 4, true) : date),
        time: (isEmpty(time) ? customTime(new Date(), 6, true) : time),
      }
    })
    ;

    //请求本命数据
    this.props.dispatch({
      type: 'astro/get_astro_data'
    });
    //请求笔记数量数据
    this.props.dispatch({
      type: 'astro/get_note_count'
    });

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
    if (0 == index) {//合盘
      goToCommonPage(PAGES.PAGE_RECORD_SELECT, '?type=' + RECORD_SELECT_TYPES.SELECT_TWO);
    } else {
      this.props.dispatch({
        type: 'astro/save',
        payload: {
          tab_index: index,
          data: '',
        }
      });
      //请求星盘数据
      this.props.dispatch({
        type: 'astro/get_astro_data'
      });
    }
  }

  //通用的黑色透明背景被点击
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
      type: 'astro/get_astro_data'
    })
  }

  //单盘或者双盘切换回调监听
  onSingleOrDoubleBtnClick = (bottom_left_btn_type) => {
    this.log('onSingleOrDoubleBtnClick bottom_left_btn_type=' + bottom_left_btn_type)
    this.props.dispatch({
      type: 'astro/save',
      payload: {
        single_or_double_status: bottom_left_btn_type,
        data: '',
      }
    })
    //请求星盘数据
    this.props.dispatch({
      type: 'astro/get_astro_data'
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
      type: 'astro/get_astro_data'
    });
  }

  //时间间隔切换
  onTimeSepChange = (time_sep_index) => {
    this.setState({time_sep_index})
  }

  render() {
    const {
      rid,
      tab_index,
      count_of_note,
      data,
      tid,
      date,
      time,
      single_or_double_status,
    } = this.props;
    const {
      alert_status,
      type_index,
      bg_index,
      style_index,
      time_sep_index,
    } = this.state;

    this.log('astro detail render date=' + date + ',time=' + time)

    let btn_type = BOTTOM_LETF_BTN_TYPE.NONE;// 左下角按钮的类型：-1：不显示；0：显示参数；1：显示单盘；2：显示双盘；
    if (tab_index == 1 || tab_index == 2) {
      btn_type = BOTTOM_LETF_BTN_TYPE.PARAMS;
    } else if (tab_index == 4 || tab_index == 5 || tab_index == 7 || tab_index == 8) {
      if (BOTTOM_LETF_BTN_TYPE.DOUBLE == single_or_double_status) {
        btn_type = BOTTOM_LETF_BTN_TYPE.DOUBLE;
      } else {
        btn_type = BOTTOM_LETF_BTN_TYPE.SINGLE;
      }
    }

    this.log('astro detail page render ');

    let nav_title_info_bottom_text = ''
    if (tab_index == ASTRO_TYPES.SOLAR_RETURN) {
      nav_title_info_bottom_text = '太阳返照时间：' + data.return_time
    } else if (tab_index == ASTRO_TYPES.LUNAR_RETURN) {
      nav_title_info_bottom_text = '月亮返照时间：' + data.return_time
    }

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
            <View className='text-title'>{getNameFromRecord(getRecord(rid))}</View>
            <AtIcon
              onClick={this.actionNavTitleClick}
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
          tab_index={tab_index}
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
            <CanvasViews
              astro_type={tab_index}
              is_show_note_btn={1}
              rid={rid}
              tid={tid}
              count_of_note={count_of_note}
              btn_type={btn_type}
              astro_type_index={type_index}
              astro_bg_index={bg_index}
              astro_style_index={style_index}
              data={data}
              event_time={convertDateFromString(date + ' ' + time).getTime() / 1000}
              onStyleBtnClick={this.onStyleBtnClick}
              onTidChangeClick={this.onTidChangeClick}
              onSingleOrDoubleBtnClick={this.onSingleOrDoubleBtnClick}
            />
          )}
          {/*本命底部bar部分*/}
          {ASTRO_TYPES.NATAL == tab_index && data && (
            <BottomView
              rid={rid}
            />
          )}
          {ASTRO_TYPES.NATAL != tab_index && data && date && time && (
            <BottomTimeView
              date={date}
              time={time}
              sep_index={time_sep_index}
              onTimeChange={this.onTimeChange}
              onTimeSepChange={this.onTimeSepChange}
            />
          )}

        </ScrollView>


        {/*导航栏点击标题信息详情alert*/}
        <AstroInfoModal
          rid={rid}
          bottom_text={nav_title_info_bottom_text}
          show={alert_status == ALERT_TYPES.INFO}
          onClickAlertShadow={this.onAlertCancleClick}
        />


        {/*编辑、添加..档案alert*/}
        <AstroRecordModal
          type={0}
          rid={rid}
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

export default detail;