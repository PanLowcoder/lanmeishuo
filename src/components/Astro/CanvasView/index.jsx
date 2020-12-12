import Taro from '@tarojs/taro';
import BaseComponent from "../../BaseComponent";
import { View, Image } from '@tarojs/components';
import PropTypes from 'prop-types';
import './index.scss';
import { ASTRO_SYNASTRY_TABS, ASTRO_TABS, CONS, HOUSE, LIST_ITEM_TYPES, PHASE, PLANET } from "../../../utils/constants";
import { ossUrl } from "../../../config";
import { ASTRO_CONF_BGS, PROTECT_ANCIENT_IDS, PROTECT_IDS } from "../../../js/astro-conf";
import { showToast } from "../../../utils/common";
import { CANVAS_VIEW_TYPE, ASTRO_TID_TYPES, ASTRO_TYPES, ASTRO_SYNASTRY_TYPES, BOTTOM_LETF_BTN_TYPE } from '../../../utils/astrolabe';

const icon_astro_style = ossUrl + 'upload/images/astro/cavans/icon_astro_style.png'
const icon_astro_note = ossUrl + 'upload/images/astro/cavans/icon_astro_note.png'
const icon_astro_setting = ossUrl + 'upload/images/astro/cavans/icon_astro_setting.png'

/**
 * 详情弹出框的类型
 * @type {{FIRDARIA_SMALL: number, FIRDARIA_BIG: number, PLANET: number, HOUSE: number, NONE: number}}
 */
const POP_TYPE = {
  NONE: -1, //不弹出
  PLANET: 0, //内盘行星详情
  PLANET_OUT: 4, //外盘行星详情
  HOUSE: 1, //宫位详情
  FIRDARIA_BIG: 2, //法达大运
  FIRDARIA_SMALL: 3, //法达小运
  PROFECTION_MONTH: 4, //小限流月
  PROFECTION_YEAR: 5, //小限流年
}

//画盘的宽高（画布*rdi）
let rdi = 4;

/**
 *  星盘或者合盘-顶部tab header组件
 */
class CanvasView extends BaseComponent {
  static propTypes = {
    type: PropTypes.number,//CANVAS_VIEW_TYPE 类型：0：星盘；1：合盘；2:占卜；
    rid: PropTypes.string,//rid
    rid2: PropTypes.string,//rid2 当type=1时有效
    astro_type: PropTypes.number,//星盘类型：ASTRO_TYPES（与tab_index对应）
    count_of_note: PropTypes.string,//笔记的数量
    btn_type: PropTypes.number,//BOTTOM_LETF_BTN_TYPE
    tid: PropTypes.number,//当前选中的类型：1：现代；2：古典；3：特殊；
    astro_type_index: PropTypes.number,//星盘样式：0：中文；1：图标；
    astro_bg_index: PropTypes.number,//星盘风格：0-5
    astro_style_index: PropTypes.number,//星盘类型：0：经典；1：专业；
    data: PropTypes.object,//data 数据

    event_time: PropTypes.number,//备注时间戳

    onAstroCanvasChange: PropTypes.func,//星盘配置设置回调
    onStyleBtnClick: PropTypes.func,//星盘样式点击回调
    onTidChangeClick: PropTypes.func,//星盘类型（现代、古典、特殊）切换方法回调
    onSingleOrDoubleBtnClick: PropTypes.func,//单双盘按钮点击
  }

  static defaultProps = {
    type: 0,
    tid: 1,
    count_of_note: '',
    astro_type_index: 0,
    astro_bg_index: 0,
    astro_style_index: 0,
  };

  constructor() {
    super(...arguments)
    this.state = {
      canvas_tap_house: [],//宫位文字可点击区域
      index_house_detail_pop: -1,//展示第几个宫位的详情数据
      canvas_tap_planet: {},//内盘行星文字可点击区域
      canvas_tap_planet_out: {},//外盘行星文字可点击区域
      pop_type: -1,//弹出框的类型 POP_TYPE
      index_planet_detail_pop: -1,//【展示第几个行星的详情数据】 或者 【法达盘点击的数组index】
      index_planet: 0,//【内盘：0；外盘：1】  或者 【法达盘-小运点击index】
      canvas_tap_firdaria_small: {},//法达小运可点击区域
      canvas_tap_firdaria_big: {},//法达大运可点击区域
      canvas_tap_profection_year: {},//小运流年可点击区域
      canvas_tap_profection_month: {},//小运流月可点击区域
      width: 0,
      height: 0,
    }
  }


  componentDidMount() {
    // 只有编译为h5下面代码才会被编译
    if (process.env.TARO_ENV === 'h5') {
      // this.context = window.document.getElementById('canvas-id').getContext('2d')
      if (this.props.data)
        this.draw(this.props.data)
        this.CavasClick()
      // 只有编译为小程序下面代码才会被编译
    } else {
      this.draw(this.props.data)
      this.CavasClick()
    }
  }


  componentWillReceiveProps(nextProps, nextContext) {
    this.log('CanvasView componentWillReceiveProps props=')
    this.log(this.props)
    this.log('CanvasView componentWillReceiveProps state=')
    this.log(this.state)

    this.log('CanvasView componentWillReceiveProps nextProps=')
    this.log(nextProps)
    this.log('CanvasView componentWillReceiveProps nextContext=')
    this.log(nextContext)

    if (nextProps.data)
      this.draw(nextProps.data)

  }

  //星盘样式按钮被点击
  actionStyleBtnClick = () => {
    this.log('actionStyleBtnClick')
    this.props.onStyleBtnClick()
  }

  //笔记按钮被点击
  actionNoteBtnClick = () => {
    this.log('actionNoteBtnClick')

    if (this.props.count_of_note == 0) {//添加
      // let page_type = CANVAS_VIEW_TYPE.ASTRO == this.props.type ? NOTE_PAGE_TYPE.ASTRO : NOTE_PAGE_TYPE.DIVINATION
      //Taro.navigateTo({url: '/pages/astro/noteAddOrEdit/index?page_type=' + page_type + '&type=' + NOTE_TYPE.ADD + '&rid=' + this.props.rid + '&from=' + ASTRO_TABS[this.props.astro_type].params + '&event_time=' + this.props.event_time})
    } else {//跳转到列表
      let type = CANVAS_VIEW_TYPE.ASTRO == this.props.type ? LIST_ITEM_TYPES.ITEM_ASTRO_NOTE : LIST_ITEM_TYPES.ITEM_DIVINATION_NOTE
      //跳转到列表
      Taro.redirectTo({ url: '/pages/commonList/index?type=' + type + '&note_list_param=' + this.props.rid + '&rid=' + this.props.rid + '&from=' + ASTRO_TABS[this.props.astro_type].params + '&event_time=' + this.props.event_time })
    }
  }

  //参数或者单盘、双盘按钮被点击
  actionLeftBottomBtnClick = () => {
    this.log('actionLeftBottomBtnClick')
    // 左下角按钮的类型：-1：不显示；0：显示参数；1：显示单盘；2：显示双盘；
    if (BOTTOM_LETF_BTN_TYPE.PARAMS == this.props.btn_type) {
      let params = ''
      if (1 == this.props.type) {//合盘
        if (ASTRO_SYNASTRY_TYPES.NATAL_2 == this.props.astro_type) {
          params = '?rid=' + this.props.rid2
        } else if (ASTRO_SYNASTRY_TYPES.NATAL_1 == this.props.astro_type) {
          params = '?rid=' + this.props.rid
        }
      } else {
        params = '?rid=' + this.props.rid
      }
      Taro.navigateTo({ url: '/pages/astro/natalOrNowParamsDetail/index' + params })
    } else if (BOTTOM_LETF_BTN_TYPE.SINGLE == this.props.btn_type) {
      this.props.onSingleOrDoubleBtnClick(BOTTOM_LETF_BTN_TYPE.DOUBLE)
    } else if (BOTTOM_LETF_BTN_TYPE.DOUBLE == this.props.btn_type) {
      this.props.onSingleOrDoubleBtnClick(BOTTOM_LETF_BTN_TYPE.SINGLE)
    }
  }

  //tid切换按钮被点击
  actionTidChangeClick = (e) => {
    let tid_current = e.currentTarget.dataset.tid;
    this.log('actionTidChangeClick tid_current=' + tid_current)
    if (tid_current == ASTRO_TID_TYPES.MODERN) {
      tid_current = ASTRO_TID_TYPES.ANCIENT;
    } else if (tid_current == ASTRO_TID_TYPES.ANCIENT) {
      tid_current = ASTRO_TID_TYPES.SPECIAL;
    } else if (tid_current == ASTRO_TID_TYPES.SPECIAL) {
      tid_current = ASTRO_TID_TYPES.MODERN;
    }
    this.props.onTidChangeClick(tid_current)
  }

  //星盘设置按钮被点击
  actionSettingBtnClick = () => {
    this.log('actionSettingBtnClick')
    let chart = ''
    if (0 == this.props.type) {//星盘
      chart = ASTRO_TABS[this.props.astro_type].params
    } else {//合盘
      chart = ASTRO_SYNASTRY_TABS[this.props.astro_type].params
    }
    Taro.navigateTo({ url: '/pages/astro/astroSetting/index?tid=' + this.props.tid + '&chart=' + chart })
  }

  // 绘制的函数
  draw(data) {
    this.log('---------------draw-----------------')
    //canvas
    if (process.env.TARO_ENV === 'h5') {
      let canvas = window.document.getElementById('myCanvas' + this.props.type);
      let ctx = canvas.getContext('2d')
      this.init(canvas, ctx, data)
    } else {
      let query = Taro.createSelectorQuery().in(this.$scope)
      query.select('.canvas').fields({ node: true, size: true, context: true }).exec(res => {
        let canvas = res[0].node;
        let ctx = canvas.getContext('2d');
        //   //保存点击坐标
        this.init(canvas, ctx, data)
      })
    }

  }

  init(canvas, ctx, data) {
    const info = Taro.getSystemInfoSync()

    let screenWidth = info.screenWidth * rdi;
    // this.log('draw this.state.screenWidth= ' + screenWidth + ',org=' + info.screenWidth + ',window.screen.width=' + window.screen.width + ',this.props.astro_bg_index=' + this.props.astro_bg_index)
    //设置画布宽高
    canvas.height = canvas.width = screenWidth;
    let x = screenWidth / 2;
    let y = screenWidth / 2;

    if (this.props.astro_bg_index >= ASTRO_CONF_BGS.length) {
      return;
    }

    if (!data)
      return;

    let data1 = '';//连线的盘
    if (data instanceof Array) {//双盘
      data = data[0];
      data1 = data[1];
    }

    //----全局的变量-----
    ctx.lineWidth = 1 * rdi;//画笔线的宽度
    let canvas_tap_planet = {};//内盘行星的点击坐标数组
    let canvas_tap_planet_out = {};//外盘行星的点击坐标数组
    let canvas_tap_firdaria_small = {};//法达小运可点击区域
    let canvas_tap_firdaria_big = {};//法达大运可点击区域
    let canvas_tap_profection_year = {};//小运流年可点击区域
    let canvas_tap_profection_month = {};//小运流月可点击区域

    if (!data.planets[17]) {
      showToast('上升点度数错误！')
      return;
    }
    let asc = data.planets[17].deg;//上升点的度数
    //----全局的变量-----

    let sub_of_firdaria_or_profection = 0;//法达宽度

    //---------法达盘---------
    if (data.firdaria) {
      sub_of_firdaria_or_profection = 30 * rdi;
      this.log('画法达大运')

      let cx = screenWidth / 2;
      let ro = screenWidth / 2 - 15 * rdi;//法达大运
      // let ri = screenWidth / 2;
      let r = screenWidth / 2;


      //---------法达-小运-圆--------
      let circle1_radius = screenWidth / 2;
      ctx.fillStyle = ASTRO_CONF_BGS[this.props.astro_bg_index].astro_circle1_solid_color;
      ctx.beginPath()
      ctx.arc(x, y, circle1_radius, 0, 2 * Math.PI)
      ctx.fill()
      //---------法达-小运-圆--------

      //---------法达-大运-圆--------
      let circle2_radius = screenWidth / 2 - 15 * rdi;
      ctx.fillStyle = ASTRO_CONF_BGS[this.props.astro_bg_index].astro_circle3_solid_color;
      ctx.beginPath()
      ctx.arc(x, y, circle2_radius, 0, 2 * Math.PI)
      ctx.fill()
      //---------法达-大运-圆--------

      let deg = 0;//起始度数
      let age = Math.floor(data.firdaria.years_alive / 75) * 75;
      let i;
      for (i = 0; i < data.firdaria.details.length; i++) {
        let item = data.firdaria.details[i];
        let cross = item.main.cross;
        let pro_add_main = cross / 75;
        let sub_glyph_num = item.sub.length;// 小限星个数
        let pro_add_sub = cross / 75 / sub_glyph_num;// 小限等分每个占的度数
        let deg_sub = deg;// 小限起始度数
        let j;
        for (j = 0; j < item.sub.length; j++) {
          let item_sub = item.sub[j];
          deg_sub += pro_add_sub * 360;
          let angle_sub = Math.PI / 180 * deg_sub;

          //---------法达-小运当前选中的圆弧--------
          if (item.main.id == data.firdaria.main_luck && item_sub.id == data.firdaria.sub_luck) {
            this.log('i=' + i + ',j=' + j + ',item.main.id=' + item.main.id + ',item_sub.id=' + item_sub.id)
            let deg_sub1 = deg_sub - pro_add_sub * 360;
            let angle_sub1 = Math.PI / 180 * deg_sub1;

            ctx.strokeStyle = '#3110c7';
            ctx.lineWidth = 15 * rdi;//画笔线的宽度
            ctx.beginPath()
            ctx.arc(x, y, r - 7.5 * rdi, -Math.PI + angle_sub1, -Math.PI + angle_sub, false)
            ctx.stroke()
            ctx.lineWidth = 1 * rdi;//画笔线的宽度
          }
          //---------法达-小运当前选中的圆弧--------


          //-------画法达小运的刻度线-------
          let x2_1 = -ro * Math.cos(angle_sub) + cx;
          let y2_1 = -ro * Math.sin(angle_sub) + cx;
          let x2_2 = -r * Math.cos(angle_sub) + cx;
          let y2_2 = -r * Math.sin(angle_sub) + cx;
          ctx.font = 10 * rdi + "px Verdana";
          ctx.strokeStyle = ASTRO_CONF_BGS[this.props.astro_bg_index].astro_sign_divider_color;
          ctx.beginPath()
          ctx.moveTo(x2_1, y2_1)
          ctx.lineTo(x2_2, y2_2)
          ctx.stroke()
          //-------画法达小运的刻度线-------

          //---------法达小运文字---------
          let deg_plgyh_sub = angle_sub - pro_add_sub * Math.PI;
          let plgyh_sub_x = -(cx - 8 * rdi) * Math.cos(deg_plgyh_sub) + cx - 5 * rdi;
          let plgyh_sub_y = -(cx - 8 * rdi) * Math.sin(deg_plgyh_sub) + cx + 3 * rdi;
          let text = '';
          if (0 == this.props.astro_type_index) {//中文
            ctx.font = 10 * rdi + "px Verdana";
            text = PLANET(item_sub.id).cn;
          } else {
            ctx.font = 10 * rdi + "px iconfont";
            text = eval(PLANET(item_sub.id).glyph_cavans)
          }
          ctx.fillStyle = '#999999'
          ctx.fillText(text, plgyh_sub_x, plgyh_sub_y)
          //增加点击数组
          canvas_tap_firdaria_small[i + '-' + j] = [plgyh_sub_x, plgyh_sub_y];
          //---------法达小运文字---------
        }

        //---------法达-大运当前选中的圆弧--------
        if (item.main.id == data.firdaria.main_luck) {
          this.log('i=' + i + ',item.main.id=' + item.main.id)
          let angle_main1 = Math.PI / 180 * deg;
          let angle_main2 = Math.PI / 180 * (deg + (pro_add_main * 360))
          // deg += (pro_add_main * 360)
          ctx.strokeStyle = '#3110c7';
          ctx.lineWidth = 15 * rdi;//画笔线的宽度
          ctx.beginPath()
          ctx.arc(x, y, r - (7.5 + 15) * rdi, -Math.PI + angle_main1, -Math.PI + angle_main2, false)
          ctx.stroke()
          ctx.lineWidth = 1 * rdi;//画笔线的宽度
        }
        //---------法达-大运当前选中的圆弧--------

        //---------法达-大运-岁数 文字---------
        if (item.main.id != 16 && item.main.id != 12) {//南、北交点行星，没有岁数
          let x_age = -(ro - 8 * rdi) * Math.cos(Math.PI / 180 * (deg + 2.5)) + cx - 5 * rdi;
          let y_age = -(ro - 8 * rdi) * Math.sin(Math.PI / 180 * (deg + 2.5)) + cx;
          ctx.fillStyle = '#999'
          ctx.font = 5 * rdi + "px Verdana";
          ctx.fillText(age + '岁', x_age, y_age)
        }
        //---------法达-大运-岁数 文字---------

        //---------法达-大运-刻度线---------
        deg += (pro_add_main * 360)
        let main_angle = Math.PI / 180 * deg;
        let x1 = -r * Math.cos(main_angle) + cx;
        let y1 = -r * Math.sin(main_angle) + cx;
        let x2 = -(ro - 15 * rdi) * Math.cos(main_angle) + cx;
        let y2 = -(ro - 15 * rdi) * Math.sin(main_angle) + cx;
        ctx.strokeStyle = ASTRO_CONF_BGS[this.props.astro_bg_index].astro_sign_divider_color;
        ctx.font = 10 * rdi + "px Verdana";
        ctx.beginPath()
        ctx.moveTo(x1, y1)
        ctx.lineTo(x2, y2)
        ctx.stroke()
        //---------法达-大运-刻度线---------

        //---------法达-大运-行星 文字---------
        let deg_plgyh_main = main_angle - pro_add_main * Math.PI;
        let plgyh_main_x = -(ro - 7.5 * rdi) * Math.cos(deg_plgyh_main) + cx - 5 * rdi;
        let plgyh_main_y = -(ro - 7.5 * rdi) * Math.sin(deg_plgyh_main) + cx + 3 * rdi;
        let text = '';
        if (0 == this.props.astro_type_index) {//中文
          ctx.font = 10 * rdi + "px Verdana";
          text = PLANET(item.main.id).cn;
        } else {
          ctx.font = 10 * rdi + "px iconfont";
          text = eval(PLANET(item.main.id).glyph_cavans)
        }
        ctx.fillStyle = '#999'
        ctx.fillText(text, plgyh_main_x, plgyh_main_y)
        //增加点击数组
        canvas_tap_firdaria_big[i] = [plgyh_main_x, plgyh_main_y];
        //---------法达-大运-行星 文字---------

        age += item.main.cross;
      }
      //---------法达-当前年龄的线---------
      // 大于75岁 从头开始
      let years_alive = data.firdaria.years_alive;
      //
      let deg_now = years_alive / 75 * 360 * Math.PI / 180;
      //
      let x1_now = -r * Math.cos(deg_now) + cx;
      let y1_now = -r * Math.sin(deg_now) + cx;
      let x2_now = -(r - 30 * rdi) * Math.cos(deg_now) + cx;
      let y2_now = -(r - 30 * rdi) * Math.sin(deg_now) + cx;
      ctx.strokeStyle = '#f00'
      ctx.beginPath()
      ctx.moveTo(x1_now, y1_now)
      ctx.lineTo(x2_now, y2_now)
      ctx.stroke()
      //---------法达-当前年龄的线---------

    }
    //---------法达盘---------
    else
      //---------小限盘---------
      if (data.profection) {
        sub_of_firdaria_or_profection = 30 * rdi;
        this.log('画小限盘')
        let cx = screenWidth / 2;
        let ro = screenWidth / 2 - 15 * rdi;//法达大运
        let r = screenWidth / 2;

        //---------小限盘-流月-圆--------
        let circle1_radius = screenWidth / 2;
        ctx.fillStyle = ASTRO_CONF_BGS[this.props.astro_bg_index].astro_circle3_solid_color;
        ctx.beginPath()
        ctx.arc(x, y, circle1_radius, 0, 2 * Math.PI)
        ctx.fill()
        //---------小限盘-流月-圆--------

        //---------小限盘-流年-圆--------
        let circle2_radius = screenWidth / 2 - 15 * rdi;
        ctx.fillStyle = ASTRO_CONF_BGS[this.props.astro_bg_index].astro_circle4_solid_color;
        ctx.beginPath()
        ctx.arc(x, y, circle2_radius, 0, 2 * Math.PI)
        ctx.fill()
        //---------小限盘-流年-圆--------

        let key;
        for (key in data.profection.details) {
          let angle = asc - data.houses[key].deg;
          let next = (key == 12) ? 0 : asc - data.houses[parseInt(key) + 1].deg;
          let now = (key == 1) ? 360 : angle;
          if (next < 0) next += 360;
          if (now < 0) now += 360;
          let house_cusp_number_angle = (now - next) / 2 + next;

          //---------小限盘-流月-当前选中的圆弧--------
          if (key == data.profection.month_house) {
            let angle_year_start = Math.PI / 180 * next;
            let angle_year_end = Math.PI / 180 * now;
            ctx.strokeStyle = '#3110c7';
            ctx.lineWidth = 15 * rdi;//画笔线的宽度
            ctx.beginPath()
            ctx.arc(x, y, r - 7.5 * rdi, -Math.PI + angle_year_start, -Math.PI + angle_year_end, false)
            ctx.stroke()
            ctx.lineWidth = 1 * rdi;//画笔线的宽度
          }
          //---------小限盘-流月-当前选中的圆弧--------

          //---------小限盘-流年-当前选中的圆弧--------
          if (key == data.profection.year_house) {
            let angle_year_start = Math.PI / 180 * next;
            let angle_year_end = Math.PI / 180 * now;
            ctx.strokeStyle = '#3110c7';
            ctx.lineWidth = 15 * rdi;//画笔线的宽度
            ctx.beginPath()
            ctx.arc(x, y, ro - 7.5 * rdi, -Math.PI + angle_year_start, -Math.PI + angle_year_end, false)
            ctx.stroke()
            ctx.lineWidth = 1 * rdi;//画笔线的宽度
          }
          //---------小限盘-流年-当前选中的圆弧--------


          //---------小限盘-流年（内圈）、流月（外圈）-行星文字---------
          let x_profection_year = -(ro - 7.5 * rdi) * Math.cos(Math.PI / 180 * house_cusp_number_angle) + cx - 5 * rdi;
          let y_profection_year = -(ro - 7.5 * rdi) * Math.sin(Math.PI / 180 * house_cusp_number_angle) + cx + 3 * rdi;
          let x_profection_month = -(r - 7.5 * rdi) * Math.cos(Math.PI / 180 * house_cusp_number_angle) + cx - 5 * rdi;
          let y_profection_month = -(r - 7.5 * rdi) * Math.sin(Math.PI / 180 * house_cusp_number_angle) + cx + 3 * rdi;
          let text = '';
          if (0 == this.props.astro_type_index) {//中文
            ctx.font = 10 * rdi + "px Verdana";
            text = PLANET(data.houses[key].protect_ancient_id).cn;
          } else {
            ctx.font = 10 * rdi + "px iconfont";
            text = eval(PLANET(data.houses[key].protect_ancient_id).glyph_cavans)
          }
          this.log('profection key=' + key + ',protect_id=' + data.houses[key].protect_id + ',protect_ancient_id=' + data.houses[key].protect_ancient_id)
          ctx.fillStyle = '#999'
          ctx.fillText(text, x_profection_year, y_profection_year)
          ctx.fillText(text, x_profection_month, y_profection_month)
          //增加点击数组
          canvas_tap_profection_year[key] = [x_profection_year, y_profection_year]
          canvas_tap_profection_month[key] = [x_profection_month, y_profection_month]
          //---------小限盘-流年（内圈）、流月（外圈）-行星文字---------

        }

      }
    //---------小限盘---------


    //---------星座-圆背景---------
    let circle1_radius = screenWidth / 2 - sub_of_firdaria_or_profection;
    ctx.fillStyle = ASTRO_CONF_BGS[this.props.astro_bg_index].astro_circle1_solid_color;
    ctx.beginPath()
    ctx.arc(x, y, circle1_radius, 0, 2 * Math.PI)
    ctx.fill()
    //---------星座-圆背景---------

    //---------宫主飞星-圆背景---------
    // TODO 只有本命和天象盘有宫主飞星
    let circle2_radius = screenWidth / 2 - 30 * rdi - sub_of_firdaria_or_profection;
    ctx.fillStyle = ASTRO_CONF_BGS[this.props.astro_bg_index].astro_circle2_solid_color;
    ctx.beginPath()
    ctx.arc(x, y, circle2_radius, 0, 2 * Math.PI)
    ctx.fill()
    //---------宫主飞星-圆背景---------

    //---------宫位-圆背景---------
    let circle3_radius = screenWidth / 2 - 40 * rdi - sub_of_firdaria_or_profection;
    ctx.fillStyle = ASTRO_CONF_BGS[this.props.astro_bg_index].astro_circle3_solid_color;
    // ctx.fillStyle='#f00'
    ctx.beginPath()
    ctx.arc(x, y, circle3_radius, 0, 2 * Math.PI)
    ctx.fill()
    //---------宫位-圆背景---------

    //---------星盘里-相位的圆背景---------
    let circle4_radius = screenWidth / 2 - 60 * rdi - sub_of_firdaria_or_profection;
    ctx.fillStyle = ASTRO_CONF_BGS[this.props.astro_bg_index].astro_circle4_solid_color;
    ctx.beginPath()
    ctx.arc(x, y, circle4_radius, 0, 2 * Math.PI)
    ctx.fill()
    //---------星盘里-相位的圆背景---------

    this.log('---------')

    //---------星座-圆环-文字、守护星、刻度线---------
    let r = screenWidth / 2;
    let r2 = screenWidth / 2 - 15 * rdi;
    let cx = screenWidth / 2;
    let start = asc - (Math.floor(asc / 30) * 30)
    let j = 0;
    let i;
    for (i = start; i < start + 360; i += 30) {
      j++;
      if (j > 12) break;

      //---------星座-刻度线---------
      let line_angle = Math.PI / 180 * i;
      let x1 = -(r2 - 15 * rdi - sub_of_firdaria_or_profection) * Math.cos(line_angle)
      let y1 = -(r2 - 15 * rdi - sub_of_firdaria_or_profection) * Math.sin(line_angle)
      let x2 = -(r - sub_of_firdaria_or_profection) * Math.cos(line_angle)
      let y2 = -(r - sub_of_firdaria_or_profection) * Math.sin(line_angle)
      ctx.strokeStyle = ASTRO_CONF_BGS[this.props.astro_bg_index].astro_sign_divider_color;
      ctx.beginPath()
      ctx.moveTo(x1 + r, y1 + r)
      ctx.lineTo(x2 + r, y2 + r)
      ctx.stroke()
      //---------星座-刻度线---------

      //---------星座-文字---------
      let planet = '';
      if (0 == this.props.astro_type_index) {//中文
        ctx.font = 13 * rdi + "px Verdana";
        planet = CONS[j - 1].item;
      } else {
        ctx.font = 13 * rdi + "px iconfont";
        planet = eval(CONS[j - 1].glyph_cavans)
      }
      // 角度转换成弧度
      let angle = Math.PI / 180 * (((j - 1) * 30) + 15 - asc)
      x = -(r2 - sub_of_firdaria_or_profection) * Math.cos(angle) + cx - 5;
      y = (r2 - sub_of_firdaria_or_profection) * Math.sin(angle) + cx + 5;
      ctx.fillStyle = CONS[j - 1].color;
      ctx.beginPath()
      ctx.fillText(planet, x, y)
      //---------星座-文字---------


      //---------星座-守护星-文字---------
      let protect_id = PROTECT_IDS[j - 1];
      if (ASTRO_TID_TYPES.ANCIENT == this.props.tid) {
        protect_id = PROTECT_ANCIENT_IDS[j - 1];
      }
      let text = '';
      if (0 == this.props.astro_type_index) {//中文
        ctx.font = 10 * rdi + "px Verdana";
        text = PLANET(protect_id).cn;
      } else {
        ctx.font = 10 * rdi + "px iconfont";
        text = eval(PLANET(protect_id).glyph_cavans)
      }
      ctx.fillStyle = PLANET(protect_id).color;
      let angle_protect_planet = Math.PI / 180 * (((j - 1) * 30) + 15 / 2 - asc)
      x = -(r2 - sub_of_firdaria_or_profection) * Math.cos(angle_protect_planet) + cx - 5 * rdi;
      y = (r2 - sub_of_firdaria_or_profection) * Math.sin(angle_protect_planet) + cx;
      ctx.fillText(text, x, y)
      //---------星座-守护星-文字---------
    }
    //---------星座-圆环-文字、守护星、刻度线---------


    //---------宫位-圆环-刻度、文字、四轴、分割线---------
    let profection = false;//如果是小限盘的话，那么宫位分割线延长
    if (sub_of_firdaria_or_profection > 0 && data.profection) {
      profection = true;
    }
    let r_max = cx;//小限的宫位延长线
    let firdaria = false;//?法达盘

    let r3 = screenWidth / 2 - 40 * rdi;

    let canvas_tap_house = [];
    for (i = 1; i <= 12; i++) {
      let angle = asc - data.houses[i].deg;
      let x2 = 0;
      let y2 = 0;
      if (r_max > 0 && profection == true) {
        //宫位-圆环小限12等分的宫位线
        x2 = -(r_max) * Math.cos(Math.PI / 180 * angle)
        y2 = -(r_max) * Math.sin(Math.PI / 180 * angle)
        ctx.strokeStyle = ASTRO_CONF_BGS[this.props.astro_bg_index].astro_house_divider_other_color;
      } else {
        if (i != 1 && i != 4 && i != 7 && i != 10) {
          //---------宫位-圆环12等分的宫位线---------
          x2 = -(r3 - sub_of_firdaria_or_profection) * Math.cos(Math.PI / 180 * angle)
          y2 = -(r3 - sub_of_firdaria_or_profection) * Math.sin(Math.PI / 180 * angle)
          ctx.strokeStyle = ASTRO_CONF_BGS[this.props.astro_bg_index].astro_house_divider_other_color;
          //---------宫位-圆环12等分的宫位线---------
        } else {
          //--------四轴（上升、下降线）---------
          x2 = -(r + 6 * rdi - sub_of_firdaria_or_profection) * Math.cos(Math.PI / 180 * angle)
          y2 = -(r + 6 * rdi - sub_of_firdaria_or_profection) * Math.sin(Math.PI / 180 * angle)
          if (firdaria === true) {
          }
          ctx.strokeStyle = ASTRO_CONF_BGS[this.props.astro_bg_index].astro_house_divider_main_color;
          //--------四轴（上升、下降线）---------
        }
      }

      //---------画上面的线---------
      ctx.beginPath()
      ctx.moveTo(r, r)
      ctx.lineTo(x2 + r, y2 + r)
      ctx.stroke()
      //---------画上面的线---------

      //---------宫位-圆环-刻度---------
      let h;
      for (h = 1; h <= 30; h++) {
        let line_angle = Math.PI / 180 * ((i * 30) + h)
        let sub = 0;
        if (0 == h % 6) {//大刻度
          sub = 10 * rdi;
          ctx.strokeStyle = ASTRO_CONF_BGS[this.props.astro_bg_index].astro_mark72_line_color;
        } else {//小刻度
          sub = 5 * rdi;
          ctx.strokeStyle = ASTRO_CONF_BGS[this.props.astro_bg_index].astro_mark360_line_color;
        }
        let x1 = -(r3 - sub - sub_of_firdaria_or_profection) * Math.cos(line_angle)
        let y1 = -(r3 - sub - sub_of_firdaria_or_profection) * Math.sin(line_angle)
        x2 = -(r3 - sub_of_firdaria_or_profection) * Math.cos(line_angle)
        y2 = -(r3 - sub_of_firdaria_or_profection) * Math.sin(line_angle)

        ctx.beginPath()
        ctx.moveTo(x1 + r, y1 + r)
        ctx.lineTo(x2 + r, y2 + r)
        ctx.stroke()
      }
      //---------宫位-圆环-刻度---------

      //---------宫位-圆环-12宫位的文字---------
      let next = (i == 12) ? 0 : asc - data.houses[i + 1].deg;
      let now = (i == 1) ? 360 : angle;
      if (next < 0) next += 360;
      if (now < 0) now += 360;
      // 宫头数字
      let house_cusp_number_angle = (now - next) / 2 + next;
      x = -(r3 - 15 * rdi - sub_of_firdaria_or_profection) * Math.cos(Math.PI / 180 * house_cusp_number_angle) + cx - 5;
      y = -(r3 - 15 * rdi - sub_of_firdaria_or_profection) * Math.sin(Math.PI / 180 * house_cusp_number_angle) + cx;
      ctx.font = 8 * rdi + "px Verdana";
      ctx.fillStyle = HOUSE(i).color;
      ctx.fillText(i.toString(), x, y)
      // this.log('house i=' + i + ',x=' + x + ',y=' + y)
      canvas_tap_house.push([x, y])
      //---------宫位-圆环-12宫位的文字---------
    }
    //---------外圈3（宫位）的刻度、文字、四轴、分割线---------


    //---------最里面的圆-行星文字、行星点、行星文字和点之间的连线---------
    //行星点
    let r6 = screenWidth / 2 - 100 * rdi - sub_of_firdaria_or_profection;

    if (data1) {
      let arr = this.sort_pl_by_longitude(data1.planets)
      let sort_reset = this.reset_sort_pl_longitude(arr[0], arr[1])

      //外盘行星文字
      let r5 = screenWidth / 2 - 80 * rdi - sub_of_firdaria_or_profection;
      let i;
      for (i in data1.planets) {
        let item = data1.planets[i];

        //---------画行星点---------
        let angle = Math.PI / 180 * (item.deg - asc)
        let x1 = -(r6) * Math.cos(angle) + cx;
        let y1 = (r6) * Math.sin(angle) + cx;

        ctx.fillStyle = PLANET(i).color;
        ctx.beginPath()
        ctx.arc(x1, y1, 2 * rdi, 0, 2 * Math.PI)
        ctx.fill()
        //---------画行星点---------

        //---------画行星文字---------
        let angle2 = Math.PI / 180 * (sort_reset[i] - asc)

        let x2 = -(r5 + 15 * rdi) * Math.cos(angle2) + cx;
        let y2 = (r5 + 15 * rdi) * Math.sin(angle2) + cx;

        let text = '';
        if (0 == this.props.astro_type_index) {//中文
          ctx.font = 10 * rdi + "px Verdana";
          text = PLANET(i).cn;
        } else {
          ctx.font = 10 * rdi + "px iconfont";
          text = eval(PLANET(i).glyph_cavans)
        }

        ctx.fillStyle = PLANET(i).color;
        ctx.fillText(text, x2, y2)
        canvas_tap_planet_out[i] = ([x2, y2])
        //---------画行星文字---------

        //---------画行星文字和点之间的线---------
        let x3 = -(r5 + cx * 2 * (6 / 640)) * Math.cos(angle2) + cx;
        let y3 = (r5 + cx * 2 * (6 / 640)) * Math.sin(angle2) + cx;
        ctx.strokeStyle = ASTRO_CONF_BGS[this.props.astro_bg_index].astro_planet_indicator_line_color;
        ctx.beginPath()
        ctx.moveTo(x1, y1)
        ctx.lineTo(x3, y3)
        ctx.stroke()
        //---------画行星文字和点之间的线---------
      }
    }

    if (data) {
      let arr = this.sort_pl_by_longitude(data.planets)
      let sort_reset = this.reset_sort_pl_longitude(arr[0], arr[1])

      //行星内盘文字
      let r5 = screenWidth / 2 - 90 * rdi - sub_of_firdaria_or_profection;
      let i;
      for (i in data.planets) {
        let item = data.planets[i];

        //---------画行星点---------
        let angle = Math.PI / 180 * (item.deg - asc)
        let x1 = -(r6) * Math.cos(angle) + cx;
        let y1 = (r6) * Math.sin(angle) + cx;

        ctx.fillStyle = PLANET(i).color;
        ctx.beginPath()
        ctx.arc(x1, y1, 2 * rdi, 0, 2 * Math.PI)
        ctx.fill()
        //---------画行星点---------

        //---------画行星文字---------
        let angle2 = Math.PI / 180 * (sort_reset[i] - asc)
        let x2 = -(r5 + 15 * rdi) * Math.cos(angle2) + cx;
        let y2 = (r5 + 15 * rdi) * Math.sin(angle2) + cx;

        let text = '';
        if (0 == this.props.astro_type_index) {//中文
          ctx.font = 10 * rdi + "px Verdana";
          text = PLANET(i).cn;
        } else {
          ctx.font = 10 * rdi + "px iconfont";
          text = eval(PLANET(i).glyph_cavans)
        }
        if (data.profection) {//小限盘，只有当前流年、流月的行星才显示颜色
          if (i == data.houses[data.profection.year_house].protect_ancient_id || i == data.houses[data.profection.month_house].protect_ancient_id) {
            ctx.fillStyle = PLANET(i).color;
          } else {
            ctx.fillStyle = '#999'
          }
        } else {
          ctx.fillStyle = PLANET(i).color;
        }

        ctx.fillText(text, x2, y2)
        canvas_tap_planet[i] = ([x2, y2])
        //---------画行星文字---------

        //---------画行星文字和点之间的线---------
        let x3 = -(r5 + cx * 2 * (6 / 640)) * Math.cos(angle2) + cx;
        let y3 = (r5 + cx * 2 * (6 / 640)) * Math.sin(angle2) + cx;
        ctx.strokeStyle = ASTRO_CONF_BGS[this.props.astro_bg_index].astro_planet_indicator_line_color;
        ctx.beginPath()
        ctx.moveTo(x1, y1)
        ctx.lineTo(x3, y3)
        ctx.stroke()
        //---------画行星文字和点之间的线---------
      }
    }
    //---------最里面的圆-行星文字、行星点、行星文字和点之间的连线---------


    //---------外圈4（相位线）行星点之间的连线---------
    // this.log(data1)
    if (data1) {//双盘
      this.log('双盘外盘')
      let i;
      for (i = 0; i < data1.phase.length; i++) {
        let item_phase = data1.phase[i];
        // this.log(item_phase)

        //起始点
        let l1 = data.planets[item_phase.id2].deg;
        let angle = Math.PI / 180 * (l1 - asc)
        x = -(r6) * Math.cos(angle) + cx;
        y = (r6) * Math.sin(angle) + cx;

        //终结点
        let l2 = data1.planets[item_phase.id1].deg;
        let angle_phase = Math.PI / 180 * (l2 - asc)
        let x_phase = -(r6) * Math.cos(angle_phase) + cx;
        let y_phase = (r6) * Math.sin(angle_phase) + cx;

        // this.log('i=' + i + ',l1=' + l1 + ',l2=' + l2 + ',asc=' + asc)

        //设置透明度
        ctx.globalAlpha = Math.abs(1.1 - parseFloat(item_phase.orb) / parseInt(item_phase.or_orb))
        //设置颜色
        ctx.strokeStyle = PHASE(item_phase.phase_deg).color;

        ctx.beginPath()
        ctx.moveTo(x, y)
        ctx.lineTo(x_phase, y_phase)
        ctx.stroke()
        //---------外圈4（相位线）行星点之间的连线---------

      }
    } else {//单盘
      this.log('双盘内盘')
      let i;
      for (i = 0; i < data.phase.length; i++) {
        let item = data.phase[i];
        let l1 = data.planets[item.id1].deg;
        let l2 = data.planets[item.id2].deg;
        let angle = Math.PI / 180 * (l1 - asc)
        x = -(r6) * Math.cos(angle) + cx;
        y = (r6) * Math.sin(angle) + cx;

        let angle_phase = Math.PI / 180 * (l2 - asc)
        let x_phase = -(r6) * Math.cos(angle_phase) + cx;
        let y_phase = (r6) * Math.sin(angle_phase) + cx;

        //设置透明度
        ctx.globalAlpha = Math.abs(1.1 - parseFloat(item.orb) / parseInt(item.or_orb))
        //设置颜色
        if (data.profection) {//小限盘，只有当前流年、流月的行星才显示颜色
          if (item.id1 == data.houses[data.profection.year_house].protect_ancient_id || item.id1 == data.houses[data.profection.month_house].protect_ancient_id) {
            ctx.strokeStyle = PHASE(item.phase_deg).color;
          } else {
            ctx.strokeStyle = '#999'
          }
        } else {
          ctx.strokeStyle = PHASE(item.phase_deg).color;
        }

        ctx.beginPath()
        ctx.moveTo(x, y)
        ctx.lineTo(x_phase, y_phase)
        ctx.stroke()
        //---------外圈4（相位线）行星点之间的连线---------

      }
    }
    //设置透明度为不透明
    ctx.globalAlpha = 1.0;

    //保存点击坐标
    this.setState({ canvas_tap_house })
    this.setState({ canvas_tap_planet })
    this.setState({ canvas_tap_planet_out })
    this.setState({ canvas_tap_firdaria_big })
    this.setState({ canvas_tap_firdaria_small })
    this.setState({ canvas_tap_profection_year })
    this.setState({ canvas_tap_profection_month })
  }
  
  CavasClick() {
    console.log('---------------click-----------------')
    //canvas
    if (process.env.TARO_ENV === 'h5') {
      let canvas = document.getElementById("myCanvas"+this.props.type);
      let canva = canvas.getBoundingClientRect()
      this.setState({canvas:canva})
    } else {
      let that =this;
      let query = Taro.createSelectorQuery().in(this.$scope)
          query.select("#myCanvas"+that.props.type).boundingClientRect(function(res){
      let canvas = res;
        that.setState({canvas:canvas})
      }).exec()
    }

  }

  //画布被点击
  actionCavasClick = (e) => {
     const canvas = this.state.canvas
      console.log(e)
      console.log(canvas)
       if (process.env.TARO_ENV === 'h5') {
      var x = (e.pageX - canvas.left) * rdi;
      var y = (e.pageY - canvas.top) * rdi;
      console.log('actionCavasClick x=' + x + ',y=' + y)
    } else {
      var x = (e.detail.x - canvas.left) * rdi;
      var y = (e.detail.y - canvas.top) * rdi;
      console.log('actionCavasClick x=' + x + ',y=' + y)
    }

      let area = 10 * rdi;
      //检测宫位文字是否被点击
      this.state.canvas_tap_house.map((item, index) => {
        if (Math.abs(x - item[0]) < area && Math.abs(y - item[1]) < area) {
          this.log('click ' + index + ' house text')
          this.setState({ index_house_detail_pop: index, pop_type: POP_TYPE.HOUSE })
        }
      })
      //内盘检测行星文字是否被点击
      let key;
      for (key in this.state.canvas_tap_planet) {
        let item = this.state.canvas_tap_planet[key];
        if (Math.abs(x - item[0]) < area && Math.abs(y - item[1]) < area) {
          this.log('click ' + key + ' planet text')
          this.setState({ index_planet_detail_pop: key, index_planet: 0, pop_type: POP_TYPE.PLANET })
        }
      }
      //外盘检测行星文字是否被点击
      for (key in this.state.canvas_tap_planet_out) {
        let item = this.state.canvas_tap_planet_out[key];
        if (Math.abs(x - item[0]) < area && Math.abs(y - item[1]) < area) {
          this.log('click ' + key + ' planet text')
          this.setState({ index_planet_detail_pop: key, index_planet: 1, pop_type: POP_TYPE.PLANET_OUT })
        }
      }
      //法达盘-大运、小运被点击
      if (ASTRO_TYPES.FIRDARIA == this.props.astro_type) {
        //小运
        let key;
        for (key in this.state.canvas_tap_firdaria_small) {
          let item = this.state.canvas_tap_firdaria_small[key];
          if (Math.abs(x - item[0]) < area && Math.abs(y - item[1]) < area) {
            this.log('click ' + key + ' small firdaria text')
            let tmp_arr = key.split('-')
            this.setState({
              index_planet_detail_pop: parseInt(tmp_arr[0]),
              index_planet: parseInt(tmp_arr[1]),
              pop_type: POP_TYPE.FIRDARIA_SMALL
            })
          }
        }
        //大运

        for (key in this.state.canvas_tap_firdaria_big) {
          let item = this.state.canvas_tap_firdaria_big[key];
          if (Math.abs(x - item[0]) < area && Math.abs(y - item[1]) < area) {
            this.log('click ' + key + ' big firdaria text')
            this.setState({ index_planet_detail_pop: key, index_planet: -1, pop_type: POP_TYPE.FIRDARIA_BIG })
          }
        }
      }
      //小限盘-流年、流月被点击
      if (ASTRO_TYPES.PROFECTION == this.props.astro_type) {
        //流月
        let key;
        for (key in this.state.canvas_tap_profection_month) {
          let item = this.state.canvas_tap_profection_month[key];
          if (Math.abs(x - item[0]) < area && Math.abs(y - item[1]) < area) {
            this.log('click profection month key=' + key)
            this.setState({
              index_planet_detail_pop: parseInt(key),
              pop_type: POP_TYPE.PROFECTION_MONTH
            })
          }
        }
        //流年
        for (key in this.state.canvas_tap_profection_year) {
          let item = this.state.canvas_tap_profection_year[key];
          if (Math.abs(x - item[0]) < area && Math.abs(y - item[1]) < area) {
            this.log('click profection year key=' + key)
            this.setState({
              index_planet_detail_pop: parseInt(key),
              pop_type: POP_TYPE.PROFECTION_YEAR
            })
          }
        }

      }
  
  }

  //宫位详情或者星座详情pop被点击
  actionHouseDetailPopClick = () => {
    this.log('actionHouseDetailPopClick')
    this.setState({ index_house_detail_pop: -1, index_planet_detail_pop: -1, pop_type: POP_TYPE.NONE })
  }

  render() {

    const {
      type,
      count_of_note,
      btn_type,
      tid,
      data,
      astro_type,
    } = this.props;

    const {
      index_house_detail_pop,
      index_planet_detail_pop,
      index_planet,
      pop_type,
    } = this.state;

    this.log('CanvasView render btn_type ==' + btn_type)

    //点击的宫位详情
    let house_detail = '';
    if (index_house_detail_pop > 0) {
      if (data instanceof Array) {//双盘
        house_detail = data[0].houses[index_house_detail_pop + 1];
      } else {//单盘
        house_detail = data.houses[index_house_detail_pop + 1];
      }
    }
    //点击的星座详情
    let planet_detail = '';
    let planet_detail_phases = [];
    if (parseInt(index_planet_detail_pop) >= 0 && ((0 == type && POP_TYPE.FIRDARIA_SMALL != pop_type && POP_TYPE.FIRDARIA_BIG != pop_type && POP_TYPE.PROFECTION_YEAR != pop_type && POP_TYPE.PROFECTION_MONTH != pop_type) || (1 == type))) {
      if (data instanceof Array) {//双盘
        if (0 == index_planet) {
          planet_detail = data[0].planets[index_planet_detail_pop];
        } else {
          planet_detail = data[1].planets[index_planet_detail_pop];
        }
      } else {//单盘
        planet_detail = data.planets[index_planet_detail_pop];
      }
      let key;
      for (key in planet_detail.phase) {
        planet_detail_phases.push(planet_detail.phase[key])
      }
    }
    // this.log('planet_detail=')
    // this.log(planet_detail)

    // this.log('planet_detail_phases=')
    // this.log(planet_detail_phases)

    this.log('CanvasView render pop_type=' + pop_type + ' data=')
    this.log(data)

    return (
      <View className='astro-canvas-page'>
        {/*顶部星盘样式和笔记*/}
        <View className='top-con'>
          <Image
            onClick={this.actionStyleBtnClick}
            className='img'
            src={icon_astro_style}
          />
          {/*笔记按钮*/}
          {(CANVAS_VIEW_TYPE.ASTRO == type || CANVAS_VIEW_TYPE.DIVINATION == type) && (
            <View
              className='note-con'
              onClick={this.actionNoteBtnClick}
            >
              <Image
                className='img-note'
                src={icon_astro_note}
              />
              {count_of_note > 0 && (
                <View className='count'>{count_of_note}</View>
              )}
            </View>
          )}
        </View>

        {/*星盘画布*/}
        <View className='canvas-con'>
          {process.env.TARO_ENV === 'h5' &&
            <canvas
              className='canvas'
              id={'myCanvas' + type}
              onClick={this.actionCavasClick}>
            </canvas>
          }
          {process.env.TARO_ENV === 'weapp' &&
            <Canvas
              type="2d"
              className='canvas'
              id='myCanvas'
              canvas-id='myCanvas'
              onClick={this.actionCavasClick}
            />
          }


          {/*宫位详情pop*/}
          {POP_TYPE.HOUSE == pop_type && index_house_detail_pop >= 0 && house_detail && data && (
            <View className='pop-house-detail-con' onClick={this.actionHouseDetailPopClick}>
              <View className='house-top-con'>
                <View
                  className='text-house'
                  style={'color:' + HOUSE(index_house_detail_pop + 1).color}
                >{index_house_detail_pop + 1}</View>
                <View className='text-common'>宫头落</View>
                <View
                  className={'iconfont icon-c' + (house_detail.in_sign_id - 1)}
                  style={'color:' + CONS[house_detail.in_sign_id - 1].color}
                />
                <View className='text-common'>{CONS[house_detail.in_sign_id - 1].name}</View>
              </View>
              <View className='text-deg'>{house_detail.in_sign_deg}</View>
              {/* 宫主星*/}
              <View className='protect-con'>
                <View className='text-common'>宫主星:</View>
                <View
                  className={'iconfont icon-p' + house_detail.protect_id}
                  style={'color:' + PLANET(house_detail.protect_id).color}
                />
                <View className='text-common'>{PLANET(house_detail.protect_id).whole}</View>
              </View>
              {/* 宫神星*/}
              <View className='protect-con'>
                <View className='text-common'>宫神星:</View>
                <View
                  className={'iconfont icon-p' + house_detail.house_almuten}
                  style={'color:' + PLANET(house_detail.house_almuten).color}
                />
                <View className='text-common'>{PLANET(house_detail.house_almuten).whole}</View>
              </View>
            </View>
          )}


          {/*行星详情pop*/}
          {(POP_TYPE.PLANET == pop_type || POP_TYPE.PLANET_OUT == pop_type) && planet_detail && data && (
            <View className='pop-house-detail-con' onClick={this.actionHouseDetailPopClick}>
              <View className='house-top-con'>
                <View
                  className={'iconfont icon-p' + (planet_detail.id)}
                  style={'color:' + PLANET(planet_detail.id).color}
                />
                <View style={'color:' + PLANET(planet_detail.id).color}>{PLANET(planet_detail.id).whole}</View>
                <View className='text-common'>{this.getPlanetSpeedName(planet_detail.speed)}</View>
                <View className='text-common'>落{CONS[planet_detail.in_sign_id - 1].name} {planet_detail.in_house_id}宫</View>
              </View>
              <View className='text-deg'>{planet_detail.in_sign_deg}</View>

              {planet_detail_phases.length > 0 && planet_detail_phases.map(item => (
                <View className='protect-con'>
                  <View className='text-common'>与</View>
                  <View
                    className={'iconfont icon-p' + item.id}
                  />
                  <View className='text-common'>{PLANET(item.id).whole}</View>
                  <View
                    className={'iconfont icon-ph' + (item.phase_e)}
                    style={'color:' + PHASE(item.phase_e).color}
                  />
                  <View
                    className='text-common'
                  >{item.phase_e}°{this.getPhaseChangeInfo(item.phase_change)}{item.phase_orb.toFixed(2)}°</View>
                </View>
              ))}

            </View>
          )}

          {/*法达盘-大运、小运详情pop*/}
          {(POP_TYPE.FIRDARIA_BIG == pop_type || POP_TYPE.FIRDARIA_SMALL == pop_type) && data && ASTRO_TYPES.FIRDARIA == astro_type && (
            <View className='pop-house-detail-con' onClick={this.actionHouseDetailPopClick}>
              <View className='house-top-con'>
                {/*大运部分*/}
                <View>
                  {PLANET(data.firdaria.details[index_planet_detail_pop].main.id).whole}大运
                </View>
                {/*小运部分*/}
                {POP_TYPE.FIRDARIA_SMALL == pop_type && (
                  <View>，{PLANET(data.firdaria.details[index_planet_detail_pop].sub[index_planet].id).whole}小运{data.firdaria.details[index_planet_detail_pop].sub[index_planet].id == data.firdaria.sub_luck ? '(经历中)' : ''}</View>
                )}
              </View>

              <View className='text-common'>
                <View>
                  {POP_TYPE.FIRDARIA_SMALL == pop_type ? data.firdaria.details[index_planet_detail_pop].sub[index_planet].start : data.firdaria.details[index_planet_detail_pop].main.start}=&gt;{POP_TYPE.FIRDARIA_SMALL == pop_type ? data.firdaria.details[index_planet_detail_pop].sub[index_planet].end : data.firdaria.details[index_planet_detail_pop].main.end}
                </View>
                <View>
                  {POP_TYPE.FIRDARIA_SMALL == pop_type ? data.firdaria.details[index_planet_detail_pop].sub[index_planet].year_min.toFixed(2) : data.firdaria.details[index_planet_detail_pop].main.year_min}岁
                  - {POP_TYPE.FIRDARIA_SMALL == pop_type ? data.firdaria.details[index_planet_detail_pop].sub[index_planet].year_max.toFixed(2) : data.firdaria.details[index_planet_detail_pop].main.year_max}岁
                </View>
              </View>

            </View>
          )}

          {/*小限盘-流月、流年详情pop*/}
          {(POP_TYPE.PROFECTION_YEAR == pop_type || POP_TYPE.PROFECTION_MONTH == pop_type) && data && ASTRO_TYPES.PROFECTION == astro_type && (
            <View className='pop-house-detail-con' onClick={this.actionHouseDetailPopClick}>
              <View className='house-top-con'>
                <View>
                  小限{POP_TYPE.PROFECTION_YEAR == pop_type ? '流年' : '流月'}征象:{PLANET(data.houses[index_planet_detail_pop].protect_ancient_id).whole}{(POP_TYPE.PROFECTION_YEAR == pop_type ? data.profection.year_house : data.profection.month_house) == index_planet_detail_pop ? '(经历中)' : ''}
                </View>
              </View>

              <View className='text-common'>
                <View>
                  {POP_TYPE.PROFECTION_YEAR == pop_type ? data.profection.details[index_planet_detail_pop].start_year : data.profection.details[index_planet_detail_pop].start_month}&nbsp;=&gt;&nbsp;{POP_TYPE.PROFECTION_YEAR == pop_type ? data.profection.details[index_planet_detail_pop].end_year : data.profection.details[index_planet_detail_pop].end_month}
                </View>
                {/*流年-岁数部分*/}
                {POP_TYPE.PROFECTION_YEAR == pop_type && (
                  <View>
                    {data.profection.details[index_planet_detail_pop].years_old_start}~{data.profection.details[index_planet_detail_pop].years_old_end}岁
                  </View>
                )}
              </View>

            </View>
          )}

        </View>

        {/*底部按钮 -1：不显示；0：显示参数；1：显示单盘；2：显示双盘；*/}
        <View className='bottom-btns-con'>

          {/*设置按钮*/}
          <View className='setting-con'>
            <View className='text' data-tid={tid} onClick={this.actionTidChangeClick}>{this.getNameFromTid(tid)}</View>
            <View className='sep'></View>
            <Image
              className='img'
              src={icon_astro_setting}
              onClick={this.actionSettingBtnClick}
            />
          </View>

          {/*参数/单盘/双盘 按钮*/}
          {btn_type != BOTTOM_LETF_BTN_TYPE.NONE && (
            <View
              onClick={this.actionLeftBottomBtnClick}
              className={(BOTTOM_LETF_BTN_TYPE.SINGLE == btn_type || BOTTOM_LETF_BTN_TYPE.DOUBLE == btn_type) ? 'btn pink' : 'btn'}
            >{btn_type == BOTTOM_LETF_BTN_TYPE.PARAMS ? '参数' : (btn_type == BOTTOM_LETF_BTN_TYPE.SINGLE ? '单盘' : '双盘')}</View>
          )}
        </View>


      </View>
    )
  }

  /**
   * 获取星盘类型
   * @param tid
   * @returns {string}
   */
  getNameFromTid(tid) {
    if (ASTRO_TID_TYPES.MODERN == tid) {
      return '现代';
    } else if (ASTRO_TID_TYPES.ANCIENT == tid) {
      return '古典';
    } else if (ASTRO_TID_TYPES.SPECIAL == tid) {
      return '特殊';
    }
  }

  /**
   * 根据速度获取行星的状态名
   * @param speed
   * @returns {string}
   */
  getPlanetSpeedName(speed) {
    let float_speed = parseFloat(speed)
    if (float_speed > 0) {
      return '[顺行]'
    } else if (float_speed == 0) {
      return '[停留]'
    } else {
      return '[逆行]'
    }
  }

  /**
   * 获取出入相
   * @param phase_change
   * @returns {string}
   */
  getPhaseChangeInfo(phase_change) {
    let int_phase_change = parseInt(phase_change)
    if (int_phase_change == 0) {
      return "[出相]";
    } else if (int_phase_change == 1) {
      return "[入相]";
    }
  }


  /**
   * 把行星拆分为两个数组并按照度数倒序，一个数组为行星的id，一个数组为行星的度数
   * @param planets
   * @returns {Array}
   */
  sort_pl_by_longitude(planets) {
    let sort_pos = {}
    let sort = {}
    let w;
    for (w in planets) {
      sort_pos[w] = w
      sort[w] = planets[w].deg
    }

    // 按度数进行排序
    let i;
    for (i = 0; i <= 20; i++) {
      if (!sort[i]) {
        continue;
      }
      let j;
      for (j = i + 1; j <= 20; j++) {
        if (!sort[j]) {
          continue;
        }

        if (sort[j] > sort[i]) {
          let temp = sort[i];
          let temp1 = sort_pos[i];

          sort[i] = sort[j];
          sort_pos[i] = sort_pos[j];

          sort[j] = temp;
          sort_pos[j] = temp1;
        }
      }
    }

    // this.log('sort=')
    // this.log(sort)
    // this.log('sort_pos=')
    // this.log(sort_pos)

    let arr = []
    arr.push(sort_pos)
    arr.push(sort)
    // this.log('sorted')
    // this.log(arr)

    return arr
  }

  /**
   * 碰撞检测，如果小于6，那么偏移8
   * @param sort_pos 行星id数组
   * @param sort 倒序的行星度数数组
   */
  reset_sort_pl_longitude(sort_pos, sort) {

    let sort_reset = sort
    let i;
    for (i = 0; i <= 20; i++) {
      if (!sort[i]) continue;
      let j;
      for (j = i + 1; j <= 20; j++) {
        if (!sort_reset[j]) continue;

        if (sort_reset[i] - sort[j] < 6) {
          sort_reset[j] -= (8 - sort_reset[i] + sort_reset[j])
        }
      }
    }

    let sort_reset_arr = []
    let w;
    for (w in sort_reset) {
      sort_reset_arr.push(sort_reset[w])
    }

    let result_map = {}
    let y = 0
    let z;
    for (z in sort_pos) {
      result_map[sort_pos[z]] = sort_reset_arr[y]
      y++
    }

    return result_map
  }

}

export default CanvasView;
