import Taro from '@tarojs/taro';
import BaseComponent from "../../../components/BaseComponent";
import RecordsAndCatsList from '../../../components/RecordsAndCatsList'
import { connect } from "@tarojs/redux";
import { goToCommonPage } from "../../../utils/common";
import { PAGES } from "../../../utils/constants";
import './index.less';

/**
 * 档案选择页面
 * type：0：全部的档案（点击跳转到星盘）；1：选择档案（单选）；2：选择档案（多选）；3：选择档案（2个【合盘使用】）；4：鉴爱选择档案（没有档案袋，有微信档案）;5：占星地图选择档案（单选，但是跳转固定）
 * selected_records：已经选择的档案
 */
@connect(({ record, common }) => ({
  ...record, ...common
}))
class recordSelect extends BaseComponent {
  config = {
    navigationBarTitleText: '档案',
  }

  constructor() {
    super(...arguments)
    this.state = {
      type: 0,//0：全部的档案（点击跳转到星盘）；1：选择档案（单选）；2：选择档案（多选）；3：选择档案（2个【合盘使用】）；4：鉴爱选择档案（没有档案袋，有微信档案）;5：占星地图选择档案（单选，但是跳转固定）
      cid: '',//档案袋的id
      record_list: Taro.getStorageSync('store_record_list'),
      cat_list: Taro.getStorageSync('store_cat_list'),
    }
  }

  componentDidMount = () => {
    let type = this.$router.params.type;
    let cid = this.$router.params.cid;
    this.setState({ type: type, cid: cid });
  };

  componentDidShow = () => {
    this.log('recordSelect componentDidShow');
  }

  //档案选中回调
  onSelectedOkClick = (records) => {
    this.log('recordSelect onSelectedOkClick');
    this.log(records);
    if (5 == this.state.type) {
      goToCommonPage(PAGES.PAGE_ACG_MAP, records.id);
      return;
    }
    let records_tmp = [];
    if (records instanceof Array) {
      records_tmp = records;
    } else {
      records_tmp.push(records);
    }
    this.log('records_tmp=');
    this.log(records_tmp);
    //保存选中的档案
    this.props.dispatch({
      type: 'common/save',
      payload: {
        selected_records: records_tmp,
      }
    });

    Taro.navigateBack();
  }


  //切换到微信档案回调
  onTabToWechatRecords = () => {
    this.log('onTabToWechatRecords');
    this.requestFirstPage();
  }

  //加载第一页内容
  requestFirstPage = () => {
    //保存type
    this.props.dispatch({
      type: 'record/save',
      payload: {
        list: [],
        page: 1,
      }
    });

    //请求列表
    this.props.dispatch({
      type: 'record/lists',
      payload: {
        page: 1,
      }
    });
  }

  //列表加载更多被触发
  onListMore = () => {
    //如果loading状态为2，也就是没有更多了，那么就返回
    if (this.props.loading == 2 || this.props.loading == 1) return;

    //如果还有更多，那么加载
    let page = this.props.page + 1;
    this.log('commonList onListMore current_page=' + page);
    //保存数据
    this.props.dispatch({
      type: 'record/save',
      payload: {
        page: page,
        loading: 1,
      }
    });
    //请求列表
    this.props.dispatch({
      type: 'record/lists',
    });
  }


  render() {
    const { type, record_list, cat_list } = this.state;
    const { selected_records, list, loading } = this.props;

    this.log('record render');
    this.log(list);
    return (
      <RecordsAndCatsList
        current_tab={0}
        onSelectedOkClick={this.onSelectedOkClick}
        type={type}
        selected_records={selected_records}
        record_list={record_list}
        cat_list={cat_list}
        loading={loading}
        onListMore={this.onListMore}
        onTabToWechatRecords={this.onTabToWechatRecords}
      />
    )
  }


}

export default recordSelect;
