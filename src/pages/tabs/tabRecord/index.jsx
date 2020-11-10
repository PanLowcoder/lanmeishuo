import Taro from '@tarojs/taro';
import BaseComponent from "../../../components/BaseComponent";
import {View} from '@tarojs/components';
import {connect} from '@tarojs/redux';
import './index.scss';

import RecordsAndCatsList from '../../../components/RecordsAndCatsList'
import {EVENT_RECORD_CAT_ACTION, EVENT_RECORD_ACTION} from "../../../utils/constants";

@connect(({tabRecord, common}) => ({
  ...tabRecord,
  ...common,
}))
class tabRecord extends BaseComponent {
  config = {
    navigationBarTitleText: '档案',
  };

  constructor() {
    super(...arguments)
    this.state = {
      record_list: Taro.getStorageSync('store_record_list'),
      cat_list: Taro.getStorageSync('store_cat_list'),
    }
  }

  componentDidMount = () => {
    if (!this.props.access_token) {
      Taro.navigateTo({
        url: '/pages/login/index?callback=/pages/tabs/tabRecord/index',
      })
      return;
    }
    Taro.eventCenter.on(EVENT_RECORD_ACTION, this.eventDeleteRecord);
    Taro.eventCenter.on(EVENT_RECORD_CAT_ACTION, this.eventDeleteRecordCat);
  };

  componentDidShow = () => {
    this.log('tabRecord componentDidShow');
    this.log(this.state.record_list);

    if (!this.state.record_list || this.state.record_list.length == 0 || this.state.record_list == '' || Taro.getStorageSync('store_record_list') == '') {
      this.log('请求所有档案数据');
      //请求所有档案数据
      this.props.dispatch({
        type: 'tabRecord/recordes',
      }).then((records) => {
        this.setState({record_list: records})
      })
    } else {
      this.log('当前档案列表不为空，已保存到本地');
      // this.setState({record_list: this.props.record_list})
      // this.render()
      // this.log(this.state.record_list)
    }
    if (!this.state.cat_list || this.state.cat_list.length == 0 || this.state.cat_list == '' || Taro.getStorageSync('store_cat_list') == '') {
      this.log('请求档案袋列表');
      //请求档案袋列表
      this.props.dispatch({
        type: 'tabRecord/cats',
      }).then((cats) => {
        this.setState({cat_list: cats})
      });
    } else {
      this.log('当前档案袋列表不为空，已保存到本地');
      this.log(this.state.cat_list)
    }
    this.log(this.state.cat_list);
  }

  /**
   * 新增、编辑、删除档案袋事件监听
   * @param record action=-1：为rid；action=0或者1：record；
   * @param action 1：新增；0：编辑；-1：删除；
   */
  eventDeleteRecord = (record, action) => {
    this.log('eventDeleteRecord id=' + action);
    // let record_list = Taro.getStorageSync('store_record_list');
    let record_list = this.state.record_list;
    let id = '';
    switch (Number(action)) {
      case -1: {
        id = record;
        break;
      }
      case 0: {
        id = record.id;
        break;
      }
      case 1: {
        id = record.id;
        break;
      }
    }
    let index = -1;
    record_list.forEach((item, i) => {
      if (item.id == id) {
        this.log('delete index=' + i + ',name=' + item.name);
        index = i;
      }
    });
    this.log(record_list);
    switch (Number(action)) {
      case -1: {
        if (index > 0)
          record_list.splice(index, 1);
        break;
      }
      case 0: {
        if (index > 0)
          record_list.splice(index, 1, record);
        break;
      }
      case 1: {
        record_list.push(record);
        break;
      }
    }
    this.log(record_list);

    Taro.setStorageSync('store_record_list', record_list);
    this.props.dispatch({
      type: 'tabRecord/save',
      payload: {
        record_list: record_list,
        current_tab: 0
      }
    });
    // this.setState({record_list: record_list});
    // this.log(this.refs.RecordsAndCatsList)
    // this.refs.RecordsAndCatsList.render()
    // this.log(this.refs.RecordsAndCatsList)
  }

  /**
   * 新增、编辑、删除档案事件监听
   * @param cat action=-1：为rid；action=0或者1：record；
   * @param action 1：新增；0：编辑；-1：删除；
   */
  eventDeleteRecordCat = (cat, action) => {
    this.log('eventDeleteRecordCat id=' + action);
    //请求档案袋列表
    this.props.dispatch({
      type: 'tabRecord/cats',
    }).then((cats) => {
      this.setState({cat_list: cats})
    });

    // let cat_list = Taro.getStorageSync('store_cat_list');
    // let id = '';
    // switch (Number(action)) {
    //   case -1: {
    //     id = cat;
    //     break;
    //   }
    //   case 0: {
    //     id = cat.id;
    //     break;
    //   }
    //   case 1: {
    //     id = cat.id;
    //     break;
    //   }
    // }
    // let index = -1;
    // cat_list.forEach((item, i) => {
    //   if (item.id == id) {
    //     this.log('delete index=' + i + ',name=' + item.name);
    //     index = i;
    //   }
    // });
    // this.log(cat_list);
    //   switch (Number(action)) {
    //     case -1: {
    //       cat_list.splice(index, 1);
    //       break;
    //     }
    //     case 0: {
    //       cat_list.splice(index, 1, cat);
    //       break;
    //     }
    //     case 1: {
    //       cat_list.push(cat)
    //       break;
    //     }
    //   }
    //   this.log(cat_list);
    //
    //   Taro.setStorageSync('store_cat_list', cat_list);
    //   this.props.dispatch({
    //     type: 'tabRecord/save',
    //     payload: {
    //       cat_list: cat_list
    //     }
    //   });
    //   this.setState({cat_list: cat_list});
  }


  onTabChange = (index) => {
    this.log('tabRecord onTabChange index' + index)
    this.props.dispatch({
        type: 'tabRecord/save',
        payload: {current_tab: index}
      }
    )

  }

  render() {
    const {record_list, cat_list} = this.state;
    const {current_tab} = this.props;

    this.log('tabRecord render record length=' + record_list.length + ',cat length=' + cat_list.length + ',current_tab=' + current_tab);
    this.log(record_list)
    return (
      <View>
        <RecordsAndCatsList
          ref='RecordsAndCatsList'
          record_list={record_list}
          cat_list={cat_list}
          type={0}
          current_tab={current_tab}
          onTabChange={this.onTabChange}
        />
      </View>
    )
  }


}

export default tabRecord;
