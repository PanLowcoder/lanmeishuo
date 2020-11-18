import Taro from '@tarojs/taro';
import BaseComponent from "../BaseComponent";
import {View} from '@tarojs/components';
import PropTypes from 'prop-types';
import './index.scss';
import RecordList from '../../components/RecordList'
import CatList from '../../components/CatList';
//通用列表组件
import CommonList from '../../components/CommonList/CommonList';
import {LIST_ITEM_TYPES ,PAGES} from "../../utils/constants";
import {goToCommonPage,actionNavBack} from "../../utils/common";
import {connect} from "@tarojs/redux";
import {AtIcon} from "taro-ui";

/**
 * 档案和档案袋组件
 */
@connect(({record}) => ({
  ...record,
}))
class RecordsAndCatsList extends BaseComponent {
  static propTypes = {
    current_tab: PropTypes.number,//当前选中的tab：0：档案；1：档案袋；
    type: PropTypes.number,
    record_list: PropTypes.array,//档案列表
    cat_list: PropTypes.array,//档案袋列表
    selected_records: PropTypes.array,//已选中的档案列表
    onSelectedOkClick: PropTypes.func,//多选或者单选按钮，被点击
    onTabChange: PropTypes.func,//切换tab事件

    //-------微信档案部分---------
    wechat_list: PropTypes.array,//列表数据
    onListMore: PropTypes.func,//滑动到底部事件
    height: PropTypes.number,//列表的高度
    loading: PropTypes.number,//0：不显示加载中；1：显示加载中；2：显示没有更多了；
    onTabToWechatRecords: PropTypes.func,//切换tab到微信档案
    //-------微信档案部分---------

  }

  static defaultProps = {
    type: 0,
    record_list: [],//档案列表
    cat_list: [],//档案袋列表
    onSelectedOkClick: function () {
      this.log('RecordsAndCatsList onClickDay');
    },
  };

  constructor() {
    super(...arguments)
    this.state = {
      tabsListValue: this.props.current_tab,//顶部tab栏，当前选中标识，0：档案；1：档案袋；
    }
  }

  componentDidMount = () => {
    this.log('RecordsAndCatsList componentDidMount');
  };

  componentDidShow = () => {
    this.log('RecordsAndCatsList componentDidShow');
  }

  componentWillReceiveProps = () => {
    this.log('RecordsAndCatsList componentWillReceiveProps')
  }

  //新建按钮被点击
  actionNewRecordBtn = () => {
    //this.log('actionNewRecordBtn current tab=' + this.state.tabsListValue);
    if (this.state.tabsListValue == 0) {
      Taro.navigateTo({
        url: '/pages/record/recordAdd/index?type=0',
      })
    } else {
      Taro.navigateTo({
        url: '/pages/record/recordCatAdd/index?type=0',
      })
    }

  }


  actionItemClick = (e) => {
    let id = e.currentTarget.dataset.id;
    goToCommonPage(PAGES.PAGE_CAT_RECORDS, '?cid=' + id + '&type=' + this.props.type);
  }

  //侧滑打开（完全打开时触发）
  actionItemSwiperOpened = () => {
    this.log('actionItemSwiperOpened');
  }

  //侧滑关闭（完全关闭时触发）
  actionItemSwiperClosed = () => {
    this.log('actionItemSwiperClosed');
  }

  actionSwiperItemClick = (option) => {
    this.log('actionSwiperItemClick')
    this.log(option);
    if (option.text == '编辑') {
      this.log('edit')
      Taro.navigateTo({url: '/pages/record/recordCatAdd/index?type=1&id=' + option.id})
    } else if (option.text == '删除') {
      this.log('delete')
      Taro.showModal({
        content: '确定要删除此档案袋吗？',
        cancelText: '取消',
        confirmText: '确定',
        confirmColor: '#FF6C89'
      }).then(res => {
        if (res.confirm) {
          this.props.dispatch({
            type: 'record/save',
            payload: {
              record_edit_or_delete_id: option.id
            }
          });
          this.props.dispatch({
            type: 'record/record_cat_delete'
          });
        }
      });
    }
  }
  //tab点击事件
  actionTabItem = (e) => {
    let index = e.currentTarget.dataset.index;
    this.log('actionTabItem index=' + index)
    this.setState({tabsListValue: index})
    if (this.props.onTabChange)
      this.props.onTabChange(index);
    if (this.props.type == 4 && index == 1) {
      this.props.onTabToWechatRecords();
    }
  }

  render() {
    const {
      type,
      selected_records,
      record_list,
      loading,
      wechat_list,
      cat_list,
    } = this.props;


    this.log('RecordsAndCatsList render record length=' + record_list.length + ',cat_list=' + cat_list.length + ',type=' + type);
    this.log(record_list)

    const {tabsListValue} = this.state;
    let tabList = [
      {title: '档案'},
      {title: '档案袋'},
    ];

    if (type && type == 4) {
      tabList = [
        {title: '档案'},
        {title: '微信档案'},
      ];
    }


    return (
      <View className='record-page'>
        <View className='nav-container'>
          {/*tab栏*/}
          <View className='tab-container'>
            <View className='tabs'>
              {tabList && tabList.length > 0 && tabList.map((item, index) =>
                <View className='item' data-index={index} onClick={this.actionTabItem}>
                  <View className={tabsListValue == index ? 'title title-selected' : 'title '}>{item.title}</View>
                </View>
              )}
            </View>
          </View>
        </View>
        <View className='new_btn' onClick={this.actionNewRecordBtn}>新建</View>

        {/*返回按钮（只有选择档案的时候才显示）*/}
        {type != 0 && (
          <AtIcon
            onClick={this.actionNavBack}
            value='chevron-left'
            className='nav-back'
          />
        )}

        {/*档案列表tab*/}
        {tabsListValue == 0 && (
          <RecordList
            onSelectedOkClick={this.props.onSelectedOkClick}
            type={type}
            record_list={record_list}
            selected_records={selected_records}
          />
        )}

        {/*档案袋tab*/}
        {type != 4 && tabsListValue == 1 && (
          <CatList
            type={type}
            cat_list={cat_list}
          />
        )}

        {/*微信档案tab*/}
        {type == 4 && tabsListValue == 1 && (
          <View>
            <CommonList
              type={LIST_ITEM_TYPES.ITEM_LOVE_WECHAT_RECORD}
              height={800}
              onListMore={this.onListMore}
              onSelectedOkClick={this.props.onSelectedOkClick}
              loading={loading}
              list={wechat_list && wechat_list.length > 0 && wechat_list}
              onItemClick={this.onItemClick}
              empty_des='您的微信档案为空~'
            />
          </View>
        )}
      </View>
    )
  }


}

export default RecordsAndCatsList;
