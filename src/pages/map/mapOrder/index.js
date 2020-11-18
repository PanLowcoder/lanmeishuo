import Taro from '@tarojs/taro';
import BaseComponent from "../../../components/BaseComponent";
import {View, Image, ScrollView} from '@tarojs/components';
import './index.scss';

//顶部档案组件
import OrderRecords, {ORDER_RECORD_TYPE} from '../../../components/OrderRecords';
//打包方式alert
import ModalMapOrder, {MODAL_MAP_LINES_ACTION} from '../../../components/Modal/ModalMapOrder';
//支付方式选择组件
import PayTypeRadioView, {PAY_TYPE} from '../../../components/Order/PayTypeRadioView';
//支付方式选择组件
import PayBarView from '../../../components/Order/PayBarView';
import {getRecord, getSelfRecord, getTradeType, isWeiXin, showToast, wxPay} from "../../../utils/common";
import {AtNavBar} from "taro-ui";
import {getWindowHeight} from "../../../utils/style";
import {baseUrl, domainUrl, ossUrl} from "../../../config";
import {map_lines_lists, map_pay_unlock} from "../service";
import {PAY_GOODS} from "../../../utils/constants";
import {ORDER_DETAIL_TYPE} from "../../order/Detail";

//图片部分
const img_order_header = ossUrl + 'wap/images/fortune/img_order_header.png'
const img_order_lock = ossUrl + 'wap/images/map/img_order_lock.png'
const img_radio_normal = ossUrl + 'wap/images/common/img_radio_normal.png'
const img_radio_selected = ossUrl + 'wap/images/common/img_radio_selected.png'
const img_radio_selected_disable = ossUrl + 'wap/images/common/img_radio_selected_disable.png'
const img_order_unlock_all_tips = ossUrl + 'wap/images/map/img_order_unlock_all_tips.png'


class mapOrder extends BaseComponent {
  config = {
    navigationBarTitleText: '占星地图解锁',
  };

  constructor() {
    super(...arguments)
    this.state = {
      records: [],
      openid: Taro.getStorageSync('open_id'),
      rid: '',//档案的id，由上一个页面传过来
      gid: '',//当goods_type=0有效，自选解锁，传过来的命格线id
      result_lines: [],//占星地图 商品
      tmp_lines: [],//临时选中的商品列表
      selected_lines: [],//占星地图 选中的商品
      goods_type: -1,//解锁方式：0：自选解锁；1：打包解锁；
      is_show_lines_modal: false,//是否显示命格线对话框
      order_pay_type: PAY_TYPE.NONE,
    }
  }

  componentDidUpdate = () => {
  }

  componentDidMount = () => {
    let rid = this.$router.params.rid;
    let type = this.$router.params.type;
    let gid = this.$router.params.gid;

    if (!rid) {
      rid = getSelfRecord().id;
    }
    let record = getRecord(rid);
    let records = [];
    records.push(record);
    this.setState({records, rid, goods_type: type, gid})

    this.requestLinesGoods(rid);
  }


  componentDidShow = () => {
  }

  //打包方式点击
  onGoodsType = (e) => {
    let goods_type = e.currentTarget.dataset.type;
    this.log('onType goods_type=' + goods_type);
    this.setState({goods_type})
  }

  //支付方式点击
  onClickPayTypeItem = (id) => {
    this.log('onClickPayTypeItem type=' + id);
    this.setState({order_pay_type: id})
  }

  //导航栏返回按钮
  actionNavBack = () => {
    Taro.showModal({
      cancelText: '我再想想',
      confirmText: '去意已决',
      confirmColor: '#FF6C89',
      content: '亲，您确定要放弃购买吗？',
    })
      .then(res => {
        if (res.confirm) {
          Taro.navigateBack()
        }
      })
  }

  //支付按钮被点击
  onPay = () => {
    this.log('onPay');
    if (-1 == this.state.order_pay_type) {
      showToast('请选择支付方式');
      return;
    }

    if (0 == this.state.goods_type) {
      //如果是选择的线，那么检查选择的是否为空
      this.log('this.state.selected_lines.length =' + this.state.selected_lines.length)
      let pay_lines = [];
      let gids = '';
      this.state.selected_lines.map((item) => {
        if (item.is_selected) {
          pay_lines.push(item);
          gids += item.gid + ',';
        }
      })
      if (gids.length > 0) {
        gids = gids.substr(0, gids.length - 1);
      }
      if (pay_lines.length == 0) {
        showToast('您还没有选择命格线')
        return;
      }
      //提示打包解锁
      Taro.showModal({
        title: '准准提示您',
        cancelText: '回去打包',
        confirmText: '仍然购买',
        confirmColor: '#FF6C89',
        content: '现在打包解锁仅需99元，超值优惠，您确定要错过吗？',
      })
        .then(res => {
          if (res.confirm) {
            // 1=>打包,2=>不打包
            this.payMethod(this.state.rid, gids, this.state.order_pay_type, 2);
          }
        })
    } else {
      this.payMethod(this.state.rid, '', this.state.order_pay_type, 1);
    }

  }

  payMethod = (rid, gids, trade_type, type) => {
    if (isWeiXin() && !this.state.openid) {//微信公众号支付，并且本地保存的openid不存在，那么去获取openid
      window.location.href = baseUrl + '/web/wap/wechat_login?callback_url=' + encodeURIComponent(window.location.href + '&user_info=');
      return;
    }
    this.requestPay(rid, gids, trade_type, type);
  }

  //添加命格线按钮被点击
  actionAddLinesBtnClick = () => {
    this.setState({is_show_lines_modal: true})
  }

  //单条线被点击，回调事件
  onModalLineClickItem = (index) => {
    let result_lines = this.state.result_lines;
    let item = result_lines.lines[index];
    if (!result_lines.lines[index].is_unlock) {//未解锁状态
      if (item.is_selected) {//已选中，那么取消选中
        result_lines.lines[index].is_selected = false;
        this.log('已选中，那么取消选中' + item.name + ' ' + result_lines.lines[index].is_selected)
      } else {
        result_lines.lines[index].is_selected = true;
        this.log(item.name + ' ' + result_lines.lines[index].is_selected)
      }

      this.setState({result_lines})

    }
  }

  //确定或者取消按钮 被点击，回调事件
  onModalOkOrCancleBtnClick = (type) => {
    if (MODAL_MAP_LINES_ACTION.OK == type) {
      let selected_lines = [];
      this.state.result_lines.lines.map((item) => {
        if (item.is_selected) {
          selected_lines.push(item);
        }
      })
      this.setState({selected_lines})
    }
    this.setState({is_show_lines_modal: false})
  }

  //已经选择的线，被点击
  actionSelectedLinesItemClick = (e) => {
    let index = e.currentTarget.dataset.index;
    this.log('actionSelectedLinesItemClick index=' + index);
    let item = this.state.selected_lines[index];
    if (item.is_selected == true) {//如果已经选中了，那么取消选中
      item.is_selected = false;
    } else {
      item.is_selected = true;
    }
    let selected_lines = this.state.selected_lines;
    selected_lines[index] = item;
    this.setState({selected_lines})

    let all_lines = this.state.result_lines.lines;
    let index_tmp = -1;
    all_lines.map((item_in_all, index_in_all) => {
      if (item.gid == item_in_all.gid) {
        index_tmp = index_in_all;
      }
    })
    if (index_tmp > 0) {
      all_lines[index_tmp] = item;
      let result_lines = this.state.result_lines;
      result_lines.lines = all_lines;
      this.setState({result_lines})
    }

  }

  render() {

    const {
      records,
      goods_type,
      result_lines,
      is_show_lines_modal,
      selected_lines,
      order_pay_type,
      gid,
    } = this.state;

    let total = 0;//总价
    if (1 == goods_type) {//打包
      total = result_lines.pack_price;
    } else {
      selected_lines.map((item) => {
        if (item.is_selected) {
          total += parseFloat(item.now_price);
        }
      })
    }
    this.log('render goods_type=' + goods_type)

    return (
      <View className='map-order-page'>
        <AtNavBar
          onClickLeftIcon={this.actionNavBack}
          color='#000'
          title='占星地图解锁'
          leftIconType='chevron-left'
          fixed
        />
        <ScrollView
          className='scrollview'
          scrollY
          scrollWithAnimation
          style={'height: ' + getWindowHeight(false, true, 0) + 'px;'}
        >
          {/*顶部档案部分*/}
          <OrderRecords
            type={ORDER_RECORD_TYPE.MAP}
            records={records}
          />

          {/*运势开通标题*/}
          <View className='select-con'>
            <View className='header-con'>
              <Image className='img' src={img_order_lock}></Image>
              <View className='des'>解锁方式</View>
            </View>
          </View>
          <View className='line'></View>
          {/*自选解锁*/}
          <View className='goods-con' data-type={0} onClick={this.onGoodsType}>
            <View className='title'>自选解锁</View>
            <View className='right-con'>
              <Image
                className='img'
                src={goods_type == 0 ? img_radio_selected : img_radio_normal}
              />
            </View>
          </View>
          <View className='line'></View>
          {/*打包解锁*/}
          <View className='goods-con margin_bottom' data-type={1} onClick={this.onGoodsType}>
            <View className='left-con'>
              <View className='title'>打包解锁</View>
              {/*打包解锁img*/}
              <Image
                src={img_order_unlock_all_tips}
                className='img-unlock-all-tips'
              />
            </View>
            <View className='right-con'>
              <Image
                className='img'
                src={goods_type == 1 ? img_radio_selected : img_radio_normal}
              />
            </View>
          </View>

          {/*解锁内容*/}
          <View className='select-con'>
            <View className='header-con'>
              <Image className='img' src={img_order_header}></Image>
              <View className='des'>解锁内容</View>
              {result_lines && result_lines.description && (
                <View className='hint'>{result_lines.description}</View>
              )}
            </View>
          </View>
          <View className='line'></View>
          {/*选中的线*/}
          {0 == goods_type && selected_lines.length > 0 && selected_lines.map((item, index) => (
            <View className='selected-lines-item-con' data-index={index} onClick={this.actionSelectedLinesItemClick}>
              <View className='left-con'>
                <Image
                  src={item.is_selected ? img_radio_selected : img_radio_normal}
                  className='img'
                />
                <View className='title'>{item.name}</View>
              </View>
              <View className='right-con'>
                <View className='now-price'>￥{item.now_price}元</View>
                <View className='or-price'>{item.or_price}元</View>
              </View>
            </View>
          ))}
          {/*添加命格线*/}
          {0 == goods_type && (
            <View className='text-add-line margin_bottom' onClick={this.actionAddLinesBtnClick}>+ 添加命格线</View>
          )}
          {/*打包解锁*/}
          {1 == goods_type && (
            <View className='unlock-all-lines-con margin_bottom'>
              <View className='left-con'>
                <Image className='img-radio' src={img_radio_selected_disable}></Image>
                <View className='title'>占星地图全内容打包解锁</View>
              </View>
              <View className='text-money'>￥{total}元</View>
            </View>
          )}

          {/*支付方式选择 部分*/}
          <PayTypeRadioView
            selected_pay_type={order_pay_type}
            onClickPayTypeItem={this.onClickPayTypeItem}
          />

          {/*底部空白*/}
          <View className='bottom-con'></View>

          {/*打包方式alert*/}
          <ModalMapOrder
            show={is_show_lines_modal}
            list={result_lines.lines}
            selected_list={selected_lines}
            onModalOkOrCancleBtnClick={this.onModalOkOrCancleBtnClick}
            onModalLineClickItem={this.onModalLineClickItem}
          />

        </ScrollView>

        {/*底部支付部分*/}
        <PayBarView
          left_text='合计'
          now_price={total}
          or_price=''
          btn_type={1}
          onClickPayBtnClick={this.onPay}
        />
      </View>
    )
  }


  /**
   * 网络请求-请求占星地图商品（占星线和命运之城）
   * @param rid
   * @returns {Promise<void>}
   */
  async requestLinesGoods(rid) {
    let res = await map_lines_lists({rid})
    if (res.code == '200') {
      this.setState({result_lines: res.data})
      if (0 == this.state.goods_type && this.state.gid) {//设置上个页面传过来的选中的线
        let selected_lines = [];
        res.data.lines.map((item) => {
          if (item.gid == this.state.gid) {
            item.is_selected = true;
            selected_lines.push(item);
          }
        })
        this.log(selected_lines)
        if (selected_lines.length > 0)
          this.setState({selected_lines});


        let user_info = this.$router.params.user_info;
        this.log('mapOrder componentDidMount user_info=' + user_info);

        if (user_info) {//微信登录返回的用户信息
          let user_info_decode = decodeURIComponent(user_info);
          let wechat_user_info_obj = JSON.parse(user_info_decode);
          this.setState({openid: wechat_user_info_obj.openid});
          Taro.setStorageSync('open_id', wechat_user_info_obj.openid); //保存用户的open_id
          // alert('user_info openid=' + wechat_user_info_obj.openid)
          //请求支付接口
          this.onPay();
        }
      }
    }
  }

  /**
   * 网络请求-支付
   * @param rid
   * @param gids
   * @param trade_type
   * @param type 1=>打包,2=>不打包
   * @returns {Promise<void>}
   */
  async requestPay(rid, gids, trade_type, type) {
    let trade_type_param = getTradeType(trade_type);
    await map_pay_unlock(
      {
        rid,
        gids,
        trade_type: trade_type_param,
        type,
        openid: Taro.getStorageSync('open_id'),
        callback_url: encodeURIComponent(domainUrl + '/#/pages/order/Detail/index?type=' + ORDER_DETAIL_TYPE.MAP + '&id='),
      }
    ).then((res) => {
      if (res && res.code == '200') {//0：微信；1：支付宝；
        if (PAY_TYPE.WECHAT == trade_type) {
          if (isWeiXin()) {//微信公众号支付
            wxPay(res.data.appId, res.data.nonceStr, res.data.package, res.data.paySign, res.data.signType, res.data.timeStamp, PAY_GOODS.PAY_GOODS_MAP, res.data.order_id);
          } else {//浏览器h5微信支付
            window.location.href = res.data.mweb_url;
          }
        } else if (PAY_TYPE.ZHIFUBAO == trade_type) {//浏览器h5支付宝支付
          // alert('未实现');
          var reHtml = res.data.par_form;
          var div = document.createElement('div');
          div.innerHTML = reHtml;
          document.body.appendChild(div);
          document.forms[0].submit();
        }
      }
    })
  }
}

export default mapOrder;
