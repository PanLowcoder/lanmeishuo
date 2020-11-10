import Taro from '@tarojs/taro'
import {View, Image} from '@tarojs/components'
import BaseComponent from "../../../components/BaseComponent"
import './index.scss'
import {AtNavBar, AtAccordion, AtSwitch, AtButton} from "taro-ui"
import {showToast} from '../../../utils/common'
import {ASTRO_SETTING_H_SYS, PLANET} from "../../../utils/constants"
import {ossUrl} from "../../../config"
import {get_astro_setting, set_astro_setting, set_astro_setting_original} from "../service"
import {connect} from "@tarojs/redux";

const img_radio_selected = ossUrl + 'wap/images/common/img_radio_selected.png'
const img_radio_normal = ossUrl + 'wap/images/common/img_radio_normal.png'
const img_add = ossUrl + 'wap/images/astro/setting/img_add.png'
const img_sub = ossUrl + 'wap/images/astro/setting/img_sub.png'


/*
通用相位度数
 */
const PHASE_COMMON = [
  0,
  60,
  90,
  120,
  180
]

/*
其他相位度数
 */
const PHASE_OTHER = [
  30,
  45,
  135,
  150
]

@connect(({astro}) => ({
  ...astro
}))
class astroSetting extends BaseComponent {
  config = {
    navigationBarTitleText: '星盘配置',
  }

  constructor() {
    super(...arguments)
    this.state = {
      is_render: true,
      setting_data_state: '',
      chart: '',
      tid: '',
      list: [
        {
          name: '分宫制',
          open: false,
        },
        {
          name: '小行星',
          open: false,
        },
        {
          name: '四轴',
          open: false,
        },
        {
          name: '常用相位',
          open: false,
        },
        {
          name: '其他相位',
          open: false,
        },
        {
          name: '星体容许度',
          open: false,
        },
      ],
    }
  }

  componentDidUpdate = () => {
  }

  componentDidMount = () => {
    let chart = this.$router.params.chart
    let tid = this.$router.params.tid
    if (!chart || !tid) {
      showToast('参数错误')
      return
    } else {
      this.setState({chart, tid})
    }
    this.requestGetSettingData(chart, tid)
  }

  componentDidHide = () => {

  }

  componentWillReceiveProps = () => {

  }


  //还原按钮 被点击
  actionNavRightBtnClick = () => {
    this.log('actionNavRightBtnClick content=')
    if (!this.state.setting_data_state.is_default)
      this.requestSetSettingDataOriginal(this.state.chart, this.state.tid)
  }

  //单个标题点击事件
  actionItemClick = (index, open) => {
    this.log('actionItemClick index=' + index + ',open=' + open)
    let list = this.state.list
    list[index].open = open
    this.setState({list})
  }

  //分宫制item点击事件
  actionHsysItemClick = (e) => {
    let index = e.currentTarget.dataset.index
    let setting_data_state = this.state.setting_data_state
    setting_data_state.h_sys = ASTRO_SETTING_H_SYS[index].item
    this.log('actionInnerItemClick index=' + index + ',h_sys=' + this.state.setting_data_state.h_sys)
    this.setState({setting_data_state})
  }

  //小行星 开关事件
  actionPlanetIsShowChange = (index, value) => {
    this.log('actionPlanetIsShowChange index=' + index + ',value=' + value)
    let planets_display = this.state.setting_data_state.planets_display.split('')
    planets_display[index] = value ? 1 : 0
    let planets_display_str = ''
    let i;
    for (i = 0; i < planets_display.length; i++) {
      planets_display_str += planets_display[i]
    }
    let setting_data_state = this.state.setting_data_state
    setting_data_state.planets_display = planets_display_str
    this.setState({setting_data_state})

    this.log(setting_data_state.planets_display)
  }

  //相位开关点击事件
  actionAspsIsShowChange = (name, value) => {
    this.log('actionAspsIsShowChange name=' + name + ',value=' + value)
    let setting_data_state = this.state.setting_data_state
    this.log(setting_data_state.asps_display)
    if (value) {//打开
      setting_data_state.asps_display.push(name)
    } else {//关闭
      let index = setting_data_state.asps_display.indexOf(name)
      this.log('index=' + index)
      if (index != -1)
        setting_data_state.asps_display.splice(index, 1)
    }
    this.log(setting_data_state.asps_display)
    this.setState({setting_data_state})
  }

  //减少图片按钮被点击
  actionImgSubClick = (e) => {
    let section = e.currentTarget.dataset.section
    let index = e.currentTarget.dataset.index
    this.log('actionImgSubClick section=' + section + ',index=' + index)
    let setting_data_state = this.state.setting_data_state
    if (5 == section) {
      let value_phase = setting_data_state.planet_orb_all[index] - 0.5
      if (value_phase < 0 || value_phase > 10) {
        return;
      }
      setting_data_state.planet_orb_all[index] = value_phase;
    } else {//常用相位、其他相位的容许度

      let key_phase = PHASE_COMMON[index]
      if (3 == section) {//常用相位
        key_phase = PHASE_COMMON[index]
      } else {//其他相位
        key_phase = PHASE_OTHER[index]
      }
      let value_phase = setting_data_state.asp_orb_all[key_phase] - 0.5
      if (value_phase < 0 || value_phase > 10) {
        return;
      }
      setting_data_state.asp_orb_all[key_phase] = value_phase
      this.log(setting_data_state)
    }

    this.setState({setting_data_state: setting_data_state})

  }

  //增加图片按钮被点击
  actionImgAddClick = (e) => {
    let section = e.currentTarget.dataset.section
    let index = e.currentTarget.dataset.index
    this.log('actionImgSubClick section=' + section + ',index=' + index)
    let setting_data_state = this.state.setting_data_state
    if (5 == section) {
      let value_phase = setting_data_state.planet_orb_all[index] + 0.5
      if (value_phase < 0 || value_phase > 10) {
        return;
      }
      setting_data_state.planet_orb_all[index] = value_phase;
    } else {//常用相位、其他相位的容许度

      let key_phase = PHASE_COMMON[index]
      if (3 == section) {//常用相位
        key_phase = PHASE_COMMON[index]
      } else {//其他相位
        key_phase = PHASE_OTHER[index]
      }
      let value_phase = setting_data_state.asp_orb_all[key_phase] + 0.5
      if (value_phase < 0 || value_phase > 10) {
        return;
      }
      setting_data_state.asp_orb_all[key_phase] = value_phase
      this.log(setting_data_state)
    }

    this.setState({setting_data_state: setting_data_state})
  }

  //确认按钮被点击
  actionOkBtnClick = () => {
    this.log('actionOkBtnClick')
    this.requestSetSettingData(this.state.chart, this.state.tid)
  }

  render() {
    const {
      list,
      setting_data_state,
      is_render,
    } = this.state

    if (!is_render)
      return

    if (!setting_data_state)
      return

    //行星显隐
    let planets_display = []
    //常用相位
    let common_phases = []
    //其他相位
    let other_phases = []
    if (setting_data_state) {
      planets_display = setting_data_state.planets_display.split('')
      let key;
      for (key in setting_data_state.asp_orb_all) {
        //其他相位容许度
        let i;
        for (i = 0; i < PHASE_OTHER.length; i++) {
          if (parseInt(key) == PHASE_OTHER[i]) {
            let item = {}
            item.name = PHASE_OTHER[i]
            item.value = setting_data_state.asp_orb_all[item.name]
            item.is_selected = setting_data_state.asps_display.indexOf(item.name) == -1 ? false : true
            other_phases.push(item)
          }
        }

        //常用相位容许度
        
        for (i = 0; i < PHASE_COMMON.length; i++) {
          if (parseInt(key) == PHASE_COMMON[i]) {
            let item = {}
            item.name = PHASE_COMMON[i]
            item.value = setting_data_state.asp_orb_all[item.name]
            item.is_selected = setting_data_state.asps_display.indexOf(item.name) == -1 ? false : true
            common_phases.push(item)
          }

        }
      }
    }
    this.log('astroSetting render')
    this.log(common_phases)
    this.log(other_phases)
    this.log(list)
    this.log(setting_data_state)
    this.log(planets_display)

    return (

      <View className='astro-setting-page'>

        {/*导航栏*/}
        <AtNavBar
          className='nav'
          onClickLeftIcon={this.actionNavBack}
          color='#000'
          title=''
          leftIconType='close'
          fixed
        />
        <View
          className={setting_data_state.is_default ? 'nav-right-btn disabled' : 'nav-right-btn'}
          onClick={this.actionNavRightBtnClick}
        >还原</View>

        <View className='content-con'>
          {list && list.length > 0 && list.map((item, index) => (
            <AtAccordion
              open={item.open}
              onClick={this.actionItemClick.bind(this, index)}
              title={item.name}
            >
              {/*分宫制*/}
              {index == 0 && ASTRO_SETTING_H_SYS.map((item1, index1) => (
                <View className='item-con' onClick={this.actionHsysItemClick} data-index={index1}>
                  <View className='h-sys-con'>
                    <View className='name'>{item1.name}</View>
                    <Image
                      className='img'
                      src={setting_data_state && setting_data_state.h_sys == item1.item ? img_radio_selected : img_radio_normal}
                    />
                  </View>
                </View>
              ))}
              {/*小行星*/}
              {index == 1 && planets_display.map((item1, index1) => (
                <View className='item-con'>
                  {(index1 >= 10 && index1 <= 16) && (
                    <View className='planets-con'>
                      <View className='name'>{PLANET(index1).whole}</View>
                      <AtSwitch
                        className='switch'
                        data-index={index1}
                        color='#FF6C89'
                        checked={planets_display[index1] == 1}
                        onChange={this.actionPlanetIsShowChange.bind(this, index1)}
                      />
                    </View>
                  )}
                </View>
              ))}

              {/*四轴*/}
              {index == 2 && planets_display.map((item1, index1) => (
                <View className='item-con'>
                  {(index1 >= 17 && index1 <= 20) && (
                    <View className='planets-con'>
                      <View className='name'>{PLANET(index1).whole}</View>
                      <AtSwitch
                        className='switch'
                        disabled={(index1 == 17 || index1 == 20) ? true : false}
                        color='#FF6C89'
                        checked={planets_display[index1] == 1}
                        onChange={this.actionPlanetIsShowChange.bind(this, index1)}
                      />
                    </View>
                  )}
                </View>
              ))}

              {/*常用相位*/}
              {index == 3 && common_phases.map((item1, index1) => (
                <View className='item-con'>
                  <View className='phase-con'>
                    <View className='text-deg'>{item1.name}°</View>
                    <View className='name'>容许</View>
                    <View className='add-sub-con'>
                      <Image
                        className='img'
                        src={img_sub}
                        data-section={index}
                        data-index={index1}
                        onClick={this.actionImgSubClick}
                      />
                      <View className='text-orb'>{item1.value}</View>
                      <Image
                        className='img'
                        src={img_add}
                        data-section={index}
                        data-index={index1}
                        onClick={this.actionImgAddClick}
                      />
                    </View>
                    <AtSwitch
                      disabled={(index1 == 17 || index1 == 20) ? true : false}
                      color='#FF6C89'
                      checked={item1.is_selected}
                      onChange={this.actionAspsIsShowChange.bind(this, item1.name)}
                    />
                  </View>
                </View>
              ))}

              {/*其他相位*/}
              {index == 4 && other_phases.map((item1, index1) => (
                <View className='item-con'>
                  <View className='phase-con'>
                    <View className='text-deg'>{item1.name}°</View>
                    <View className='name'>容许</View>
                    <View className='add-sub-con'>
                      <Image
                        className='img'
                        src={img_sub}
                        data-section={index}
                        data-index={index1}
                        onClick={this.actionImgSubClick}
                      />
                      <View className='text-orb'>{item1.value}</View>
                      <Image
                        className='img'
                        src={img_add}
                        data-section={index}
                        data-index={index1}
                        onClick={this.actionImgAddClick}
                      />
                    </View>
                    <AtSwitch
                      disabled={(index1 == 17 || index1 == 20) ? true : false}
                      color='#FF6C89'
                      checked={item1.is_selected}
                      onChange={this.actionAspsIsShowChange.bind(this, item1.name)}
                    />
                  </View>
                </View>
              ))}


              {/*星体容许度*/}
              {index == 5 && planets_display.map((item1, index1) => (
                <View className='item-con'>
                  {(index1 >= 0 && index1 <= 9) && (
                    <View className='planet-orb-con'>
                      <View className='planet-name'>{PLANET(index1).whole}</View>
                      <View className='name'>容许</View>
                      <View className='add-sub-con'>
                        <Image
                          className='img'
                          src={img_sub}
                          data-section={index}
                          data-index={index1}
                          onClick={this.actionImgSubClick}
                        />
                        <View className='text-orb'>{setting_data_state.planet_orb_all[index1]}</View>
                        <Image
                          className='img'
                          src={img_add}
                          data-section={index}
                          data-index={index1}
                          onClick={this.actionImgAddClick}
                        />
                      </View>
                    </View>
                  )}
                </View>
              ))}

            </AtAccordion>
          ))}
        </View>

        {/*底部按钮*/}
        <View className='bottom-con'>
          <AtButton className='btn' type='primary' size='normal' onClick={this.actionOkBtnClick}>确定</AtButton>
        </View>

      </View>
    )
  }

  /**
   * 网络请求-获取配置数据
   * @param chart
   * @param tid
   * @returns {Promise<void>}
   */
  async requestGetSettingData(chart, tid) {
    let res = await get_astro_setting({chart, tid})
    if (res.code == '200') {
      this.setState({setting_data_state: res.data, setting_data_state_orginal: res.data})
    }
  }

  /**
   * 网络请求-设置配置数据
   * @param chart
   * @param tid
   * @returns {Promise<void>}
   */
  async requestSetSettingData(chart, tid) {
    let res = await set_astro_setting({chart, tid, chart_value: JSON.stringify(this.state.setting_data_state)})
    if (res.code == '200') {
      this.setState({setting_data_state: res.data, setting_data_state_orginal: res.data})
      this.props.dispatch({
        type: 'astro/save',
        payload: {
          is_refresh_astro: true
        }
      })
      Taro.navigateBack()
    }
  }

  /**
   * 网络请求-还原星盘配置
   * @param chart
   * @param tid
   * @returns {Promise<void>}
   */
  async requestSetSettingDataOriginal(chart, tid) {
    let res = await set_astro_setting_original({chart, tid})
    if (res.code == '200') {
      this.setState({setting_data_state: res.data, setting_data_state_orginal: res.data})
      this.props.dispatch({
        type: 'astro/save',
        payload: {
          is_refresh_astro: true
        }
      })
      Taro.navigateBack()
    }
  }

}

export default astroSetting
