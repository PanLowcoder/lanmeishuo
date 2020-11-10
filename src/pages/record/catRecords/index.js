import Taro from '@tarojs/taro';
import BaseComponent from "../../../components/BaseComponent";
import './index.scss';

import RecordList from '../../../components/RecordList'
import {connect} from "@tarojs/redux";
import {AtNavBar} from "taro-ui";
import {actionNavBack, getCat, getRecordsWithCatId, goToCommonPage} from "../../../utils/common";
import {View} from "@tarojs/components";
import {PAGES} from "../../../utils/constants";

/**
 * 档案袋点击进入的档案列表页面
 */
@connect(({record}) => ({
  ...record
}))
class catRecords extends BaseComponent {
  config = {
    navigationBarTitleText: '档案',
  };

  constructor() {
    super(...arguments)
    this.state = {
      cat_name: '',
      record_list: [],
      type: 0,//0：全部的档案；1：选择档案（单选）；2：选择档案（多选）；
    }
  }

  componentDidMount = () => {
    let cid = this.$router.params.cid;
    let type = this.$router.params.type;
    let cat = getCat(cid);
    this.log('catRecords componentDidMount cat name=' + cat.name + ',type=' + type)
    this.setState({cat_name: cat.name, record_list: getRecordsWithCatId(cid), type});
  };

  componentDidShow = () => {
    this.log('catRecords componentDidShow');
  }

  actionNavRightClick = () => {
    this.log('actionNavRightClick');
    goToCommonPage(PAGES.PAGE_RECORD_ADD, '?type=0');
  }

  //档案选中回调
  onSelectedOkClick = (records) => {
    this.log('recordSelect onSelectedOkClick');
    this.log(records);
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
    Taro.navigateBack();
  }

  render() {
    const {cat_name, record_list, type} = this.state;

    this.log('catRecords render record_list.length=' + record_list.length);

    this.log(record_list);
    return (
      <View className='cat-records-page'>
        {/*导航栏*/}
        <AtNavBar
          className='nav'
          onClickLeftIcon={this.actionNavBack}
          color='#000'
          title={cat_name}
          leftIconType='chevron-left'
          fixed
        />
        <View className='nav-right-btn' onClick={this.actionNavRightClick}>新建</View>
        <RecordList
          is_in_cat={true}
          type={type}
          record_list={record_list}
          onSelectedOkClick={this.onSelectedOkClick}
        />
      </View>
    )
  }


}

export default catRecords;
