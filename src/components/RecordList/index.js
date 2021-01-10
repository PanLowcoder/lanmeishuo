import Taro from '@tarojs/taro';
import BaseComponent from "../BaseComponent";
import {View, Image, ScrollView} from '@tarojs/components';
import {AtSearchBar, AtSwipeAction, AtButton} from "taro-ui"
import PropTypes from 'prop-types';
import './index.scss';
import {ossUrl} from "../../config";
import {CONS ,PAGES} from "../../utils/constants";
//网络错误页面
import CommonErrorOrEmptyHint from '../../components/CommonErrorOrEmptyHint';
import {getNameFromRecord, isEmpty ,goToCommonPage} from "../../utils/common";
import {connect} from "@tarojs/redux";
import {getWindowHeight} from "../../utils/style";
import {RECORD_SELECT_TYPES} from "../../pages/record/recordSelect/constants";

const img_radio_normal = ossUrl + 'wap/images/common/img_radio_normal.png'
const img_radio_selected = ossUrl + 'wap/images/common/img_radio_selected.png'
const img_hint = ossUrl + 'wap/images/record/img_hint.png'

/**
 * 档案列表组件
 */
@connect(({record}) => ({
  ...record,
}))
class RecordList extends BaseComponent {
  static propTypes = {
    is_in_cat: PropTypes.bool,//是否在档案袋中（如果在，那么 滑动显示‘移除档案袋’）
    type: PropTypes.number,
    record_list: PropTypes.array,//档案列表，未按照字母排序
    selected_records: PropTypes.array,//已选中的档案列表
    onSelectedOkClick: PropTypes.func,//多选或者单选按钮，被点击
  }

  static defaultProps = {
    is_in_cat: false,
    type: 0,
    records: [],
    onSelectedOkClick: function () {
      this.log('defaultProps onSelectedOkClick');
    },
  };

  constructor() {
    super(...arguments)
    this.state = {
      search: '',//搜索的文字
      search_records: [],//本地档案搜索结果列表
      selected_records_state: this.props.selected_records,//选中的档案
    }
  }

  componentDidMount = () => {
    this.log('RecordList componentDidMount ')
    // Taro.eventCenter.on(EVENT_RECORD_ACTION, this.eventDeleteRecord);
  }

  componentDidShow = () => {
    this.log('RecordList componentDidShow');
    this.log(this.props.record_list)
    this.log('RecordList componentDidShow over');
  }

  componentWillReceiveProps = () => {
    this.log('RecordList componentWillReceiveProps')
  }

//开始搜索按钮被点击
  onActionClick() {
    this.log('开始搜索')
  }

//搜索栏输入变化
  onChange(value) {
    let result_array = this.fuzzyQuery(this.props.record_list, value);
    this.setState({
      search: value
    });

    //保存数据
    this.setState({search_records: this.getList(result_array)});
  }

//侧滑打开（完全打开时触发）
  actionItemSwiperOpened = () => {
    this.log('actionItemSwiperOpened ');
  }

//侧滑关闭（完全关闭时触发）
  actionItemSwiperClosed = () => {
    this.log('actionItemSwiperClosed');
  }

//action 里面的item点击事件
  actionSwiperItemClick = (option) => {
    this.log('actionSwiperItemClick')
    this.log(option);
    if (option.text == '移入档案袋') {
      this.log('move')
      Taro.navigateTo({url: '/pages/record/recordMoveCat/index?rid=' + option.id})
    } else if (option.text == '编辑') {
      this.log('edit')
      Taro.navigateTo({url: '/pages/record/recordAdd/index?type=1&rid=' + option.id})
    } else if (option.text == '删除') {
      this.log('delete')
      Taro.showModal({
        content: '确定要删除' + option.name + '的档案吗？',
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
            type: 'record/record_delete'
          });
        }
      });
    } else if (option.text == '移出档案袋') {
      this.props.dispatch({
        type: 'record/save',
        payload: {
          record_edit_or_delete_id: option.id
        }
      });
      this.props.dispatch({
        type: 'record/record_move_out_cat'
      });
    }
  }

  //点击单个类型
  actionItemClick = (e) => {
    let index1 = e.currentTarget.dataset.index1;
    let index2 = e.currentTarget.dataset.index2;
    this.log('actionItemClick type=' + this.props.type + ' index1=' + index1 + ',index2=' + index2);

    let records = this.getList(this.props.record_list)
    let record = records[index1].items[index2];
    let name = record.name;
    this.log('name=' + name);

    switch (Number(this.props.type)) {
      case RECORD_SELECT_TYPES.TO_ASTRO: {
        goToCommonPage(PAGES.PAGE_ASTROLABLE, '?rid=' + record.id);
        break;
      }
      case RECORD_SELECT_TYPES.SELECT_ONE: {
        this.props.onSelectedOkClick(record);
        break;
      }
      case RECORD_SELECT_TYPES.SELECT_MUTLI: {
        //判断是否选中
        if (record.is_selected && record.is_selected == 1) {//已经选中，那么移除
          this.state.selected_records_state.splice(this.state.selected_records_state.index, 1);
          records[index1].items[index2].is_selected = 0;
        } else {//没有选中，那么添加
          record.index = this.state.selected_records_state.length;
          this.state.selected_records_state.push(record);
          records[index1].items[index2].is_selected = 1;
        }
        //保存已选中的数据
        this.setState({selected_records: this.state.selected_records_state});
        // this.log('打印已选中：');
        // this.log(this.state.selected_records_state);
        break;
      }
      case RECORD_SELECT_TYPES.SELECT_TWO: {
        //判断是否选中
        if (record.is_selected && record.is_selected == 1) {//已经选中，那么移除
          this.state.selected_records_state.splice(this.state.selected_records.index, 1);
          records[index1].items[index2].is_selected = 0;
        } else {
          //没有选中，判断已有数量
          if (2==this.state.selected_records_state.length){
            record.index = 1;
            records[index1].items[index2].is_selected = 1;
            //替换第一个
            this.state.selected_records_state.splice(0,1,records[index1].items[index2])
          }else{
            //直接添加
            record.index = this.state.selected_records_state.length;
            this.state.selected_records_state.push(record);
            records[index1].items[index2].is_selected = 1;
          }

        }
        //保存已选中的数据
        this.setState({selected_records: this.state.selected_records_state});
        this.log('打印已选中：');
        this.log(this.state.selected_records_state);
        break;
      }
      case RECORD_SELECT_TYPES.SELECT_IDENTIFY_LOVE: {
        this.props.onSelectedOkClick(record);
        break;
      }
      case RECORD_SELECT_TYPES.SELECT_MAP: {
        this.props.onSelectedOkClick(record);
        break;
      }
      default: {
        goToCommonPage(PAGES.PAGE_ASTROLABLE, '?rid=' + record.id);
      }
    }
  }

//type=2时有效，多选底部完成按钮被点击
  actionMutlSelectedOkClick = () => {
    this.log('actionMutlSelectedOkClick');
    this.log(this.state.selected_records_state);
    this.props.onSelectedOkClick(this.state.selected_records_state);
  }

//长按事件
  onLongClick = () => {
    this.log('onLongClick');
  }

  /**
   * 新增、编辑、删除档案袋事件监听
   * @param record action=-1：为rid；action=0或者1：record；
   * @param action 1：新增；0：编辑；-1：删除；
   */
  eventDeleteRecord = (record, action) => {
    this.log('eventDeleteRecord id=' + action);
    let record_list = Taro.getStorageSync('store_record_list');
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
        record_list: record_list
      }
    });
    // this.setState({record_list: record_list});
    this.render()
  }


  render() {
    const {type, selected_records, record_list, is_in_cat} = this.props;
    const {search_records, search} = this.state;
    this.log('RecordList render records=')

    // this.log('RecordList render,record_list.length=' + record_list.length + ',selected_records.length=' + selected_records ? selected_records.length : '' + ',search_records.length=' + search_records.length);

    let records = []
    if (!search_records || search_records.length == 0) {
      records = this.getList(record_list)
    } else {
      records = search_records
    }
    this.log(records)

    return (
      <View className='record-list-container'>
        {/*搜索栏和提示部分*/}
        <View className='top-container'>
          <AtSearchBar
            className='search-bar'
            showActionButton={false}
            value={search}
            onChange={this.onChange.bind(this)}
            onActionClick={this.onActionClick.bind(this)}
          />
          <View className='hint-con'>
            <Image
              className='img'
              src={img_hint}
            />
            <View className='text'>左滑可修改和删除档案，自己的档案只能修改</View>
          </View>
        </View>

        {/*列表部分*/}
        <ScrollView
          className='records-container'
          scrollY
          scrollWithAnimation
          scrollTop='0'
          style={'height:' + getWindowHeight(true, true, 90) + 'px'}
        >
          {
            records && records.length > 0 ? (
              <View className='records-ul'>
                {
                  records.map((items, index1) => (
                    <View className='records-li'>

                      {items && items.items.length > 0 && items.items.map((item, index2) => (
                        <AtSwipeAction
                          key={index1}
                          autoClose
                          onClick={this.actionSwiperItemClick}
                          onOpened={this.actionItemSwiperOpened}
                          onClosed={this.actionItemSwiperClosed}
                          options={[
                            {
                              text: '编辑',
                              id: item.id,
                              name: item.name,
                              style: {
                                backgroundColor: '#6190E8'
                              }
                            },
                            {
                              text: '删除',
                              id: item.id,
                              name: item.name,
                              style: {
                                backgroundColor: '#FF4949'
                              }
                            },
                            {
                              text: is_in_cat ? '移出档案袋' : '移入档案袋',
                              id: item.id,
                              name: item.name,
                              style: {
                                backgroundColor: '#6190E8'
                              }
                            },
                          ]}
                        >
                          <View
                            key={item.name}
                            className='item_container'
                            data-index1={index1}
                            data-index2={index2}
                            onLongClick={this.onLongClick}
                            onClick={this.actionItemClick}
                          >

                            {/*索引和头像和名字 部分*/}
                            <View className='left_container'>
                              {/*左侧索引*/}
                              {item.is_first == 1 && (
                                <View className='index'>{items.title}</View>
                              )}
                              {item.is_first == 0 && (
                                <View className='index'>&nbsp;</View>
                              )}
                              <Image
                                className='img_bg'
                                src={isEmpty(item.avatar)? CONS[(item.sun.split('-')[0] - 1)].record_default_avatar : (ossUrl + item.avatar)}
                              />
                              <View className='name'>{getNameFromRecord(item)}</View>
                            </View>
                            {/*右侧选中图片*/}
                            {(RECORD_SELECT_TYPES.SELECT_MUTLI == type || RECORD_SELECT_TYPES.SELECT_TWO == type) && (
                              <Image
                                className='radio-img'
                                src={item.is_selected == 1 ? img_radio_selected : img_radio_normal}
                              />
                            )}
                          </View>
                        </AtSwipeAction>
                      ))}

                    </View>
                  ))
                }
              </View>
            ) : (
              //为空的页面
              <CommonErrorOrEmptyHint
                type={2}
                des='没有符合条件的档案'
              />
            )
          }
          {/*<View className='bottom-con'></View>*/}
        </ScrollView>
        {/*底部完成按钮（只有多选的时候，才会有）*/}
        {(RECORD_SELECT_TYPES.SELECT_MUTLI == type || RECORD_SELECT_TYPES.SELECT_TWO == type) && (
          <View className='ok-con'>
            <AtButton
              type='primary'
              size='normal'
              onClick={this.actionMutlSelectedOkClick}
            >完成</AtButton>
          </View>
        )}
      </View>
    )
  }


  /**
   * 根据拼音分类数据
   * @param arr
   * @param empty
   * @returns {*}
   */
  pySegSort(arr, empty) {
    if (!String.prototype.localeCompare)
      return null;
    if (!arr)
      return null;
    if (arr.length == 0)
      return null;
    var letters = "*ABCDEFGHJKLMNOPQRSTWXYZ".split('');
    var zh = "阿八嚓哒妸发旮哈讥咔垃痳拏噢妑七呥扨它穵夕丫帀".split('');

    var segs = [];
    var curr;
    letters.map((letter, i) => {
      curr = {letter: letter, data: []};
      arr.map((item_data) => {
        var item = item_data.name;
        if ((!zh[i - 1] || zh[i - 1].localeCompare(item, "zh") <= 0) && item.localeCompare(zh[i], "zh") == -1) {
          curr.data.push(item_data);
        }
      });
      if (empty || curr.data.length) {
        segs.push(curr);
        curr.data.sort(function (a, b) {
          return a.name.localeCompare(b, "zh");
        });
      }
    });
    return segs;
  }

  /**
   * 使用spilt方法实现模糊查询
   * @param  {Array}  list     进行查询的数组
   * @param  {String} keyWord  查询的关键词
   * @return {Array}           查询的结果
   */
  fuzzyQuery(list, keyWord) {
    var arr = [];
    for (var i = 0; i < list.length; i++) {
      if (list[i].name.split(keyWord).length > 1) {
        arr.push(list[i]);
      }
    }
    return arr;
  }

  /**
   * 处理list结果
   * @param arr
   * @param empty
   * @returns {*}
   */
  getList(record_list) {

    let records = [];
    let list = this.pySegSort(record_list);
    if (!list) return [];
    if (list.length == 0) return [];
    for (let i = 0; i < list.length; i++) {
      let item_array = [];
      let length = list[i].data.length;
      for (let y = 0; y < length; y++) {
        list[i].data.key = list[i].letter;
        list[i].data[y].is_selected = 0;//未选中状态
        if (this.props.selected_records && this.props.selected_records.length > 0) {
          for (let w = 0; w < this.props.selected_records.length; w++) {
            if (this.props.selected_records[w].id == list[i].data[y].id) {
              //如果相同，那么设置已经选中
              list[i].data[y].is_selected = 1;
            }
          }
        }


        if (y == 0) {
          list[i].data[y].is_first = 1;//包含首字符
        } else {
          list[i].data[y].is_first = 0;//不包含首字符
        }
        item_array.push(list[i].data[y]);
      }
      let item = {
        title: list[i].letter,
        key: list[i].letter,
        items: item_array
      }
      records.push(item);
    }

    this.log('getList')
    this.log(records)
    return records;
  }
}

export default RecordList;
