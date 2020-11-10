import Taro from '@tarojs/taro';

import * as recordApi from './service';

import {EVENT_RECORD_ACTION, EVENT_RECORD_CAT_ACTION, LIST_ITEM_TYPES} from "../../utils/constants";

import {showToast} from "../../utils/common";

export default {
  namespace: 'record',
  state: {
    //==============档案选择列表页面=================
    // type: LIST_ITEM_TYPES.ITEM_LOVE_WECHAT_RECORD,//0:我的幸运星列表；
    page: 1,
    list: [],//列表数据
    loading: 0,//0：不显示加载中；1：显示加载中；2：显示没有更多了；
    list_height: Taro.getSystemInfoSync().screenHeight,//list的高度
    //==============档案选择列表页面=================

    //==============新建档案页面=================
    record_add_is_sex_modal_show: false,//是否显示性别对话框
    record_add_name: '',//档案的名字
    record_add_tag: '',//与Ta的关系标签
    record_add_avatar: '',//选中的背景图片
    record_add_sex: '',//性别
    record_add_params: {},//参数对象
    //==============新建档案页面=================

    //==============新建档案袋页面=================
    record_cat_add_bg_list: [],//档案袋背景列表
    record_cat_add_name: '',//档案袋的名字
    record_cat_add_avatar: '',//选中的背景图片
    //==============新建档案袋页面=================


    //==============删除/编辑/移入 档案/档案袋 参数=================
    record_edit_or_delete_id: '',
    //==============删除/编辑/移入 档案/档案袋 参数=================

    //==============移入档案袋 参数=================
    record_move_cat_cid: '',
    //==============移入档案袋 参数=================

  },
  effects: {
    //档案列表页面-获取微信档案
    * lists(_, {call, put, select}) {
      const {type, page, list} = yield select(state => state.record);
      //当请求第一页的时候显示加载提示
      let is_show_loading = false;
      if (page == 1) {
        is_show_loading = true;
      }

      let res = {};
      res = yield call(recordApi.get_wechat_records, {
        page: page,
      }, is_show_loading);

      if (res && res.code == '200') {
        //判断loading状态
        let loading = 0;
        //没有更多了
        if (Number(res.data.last_page) <= Number(res.data.current_page)) {
          loading = 2;
        }

        //设置数据
        let list_all = [];
        if (page == 1) {//当请求第一页数据时，直接赋值
          list_all = res.data.data;
        } else {//加载更多，组装数据
          list_all = list.concat(res.data.data);
        }

        //保存数据
        yield put({
          type: 'save', payload: {
            list: list_all,
            loading: loading,
          }
        });
      }
    },
    //新建档案-新增
    * record_add(_, {call, put, select}) {
      const {record_add_params} = yield select(state => state.record);
      const res = yield call(recordApi.addRecord,
        {
          avatar: record_add_params.avatar,
          birth_city: record_add_params.birth_city,
          birth_country: record_add_params.birth_country,
          birth_province: record_add_params.birth_province,
          comments: record_add_params.comments,
          day: record_add_params.day,
          ew: record_add_params.ew,
          hour: record_add_params.hour,
          isself: record_add_params.isself,
          lat_deg: record_add_params.lat_deg,
          lat_min: record_add_params.lat_min,
          live_city: record_add_params.live_city,
          live_country: record_add_params.live_country,
          live_province: record_add_params.live_province,
          long_deg: record_add_params.long_deg,
          long_min: record_add_params.long_min,
          minute: record_add_params.minute,
          month: record_add_params.month,
          name: record_add_params.name,
          ns: record_add_params.ns,
          timezone: record_add_params.timezone,
          type: record_add_params.type,
          year: record_add_params.year,
        });
      if (res.code == '200') {
        yield put({
          type: 'save', payload: {
            record_add_name: '',
            record_add_tag: '',
          }
        });
        Taro.eventCenter.trigger(EVENT_RECORD_ACTION, res.data, 1);
        //退回上个页面
        Taro.navigateBack();
      }
    },

    //新建档案-编辑
    * record_edit(_, {call, put, select}) {
      const {record_add_params} = yield select(state => state.record);
      const res = yield call(recordApi.editRecord,
        {
          id: record_add_params.id,
          avatar: record_add_params.avatar,
          birth_city: record_add_params.birth_city,
          birth_country: record_add_params.birth_country,
          birth_province: record_add_params.birth_province,
          comments: record_add_params.comments,
          day: record_add_params.day,
          ew: record_add_params.ew,
          hour: record_add_params.hour,
          isself: record_add_params.isself,
          lat_deg: record_add_params.lat_deg,
          lat_min: record_add_params.lat_min,
          live_city: record_add_params.live_city,
          live_country: record_add_params.live_country,
          live_province: record_add_params.live_province,
          long_deg: record_add_params.long_deg,
          long_min: record_add_params.long_min,
          minute: record_add_params.minute,
          month: record_add_params.month,
          name: record_add_params.name,
          ns: record_add_params.ns,
          timezone: record_add_params.timezone,
          type: record_add_params.type,
          year: record_add_params.year,
        });
      if (res.code == '200') {

        yield put({
          type: 'save', payload: {
            record_add_name: '',
            record_add_tag: '',
          }
        });
        Taro.eventCenter.trigger(EVENT_RECORD_ACTION, res.data, 0);
        //退回上个页面
        Taro.navigateBack();
      }
    },

    //删除档案
    * record_delete(_, {call, select}) {
      const {record_edit_or_delete_id} = yield select(state => state.record);
      const res = yield call(recordApi.deleteRecord, {id: record_edit_or_delete_id});
      if (res.code == '200') {
        showToast(res.msg);
        Taro.eventCenter.trigger(EVENT_RECORD_ACTION, record_edit_or_delete_id, -1);
      }
    },

    //新建档案袋-获取档案袋列表
    * record_cat_list(_, {call, put}) {
      const res = yield call(recordApi.getCatBgList, {});
      if (res.code == '200') {
        yield put({
          type: 'save',
          payload: {
            record_cat_add_bg_list: res.data
          },
        });
      }
    },
    //新建档案袋-新增
    * record_cat_add(_, {call, put, select}) {
      const {record_cat_add_name, record_cat_add_avatar} = yield select(state => state.record);
      const res = yield call(recordApi.addCatBg, {avatar: record_cat_add_avatar, name: record_cat_add_name});
      if (res.code == '200') {

        yield put({
          type: 'save', payload: {
            name: '',
            avatar: '',
          }
        });

        Taro.eventCenter.trigger(EVENT_RECORD_CAT_ACTION, res.data, 1);
        //退回上个页面
        Taro.navigateBack();
      }
    },

    //新建档案袋-编辑
    * record_cat_edit(_, {call, put, select}) {
      const {record_edit_or_delete_id, record_cat_add_name, record_cat_add_avatar} = yield select(state => state.record);
      const res = yield call(recordApi.editRecordCat, {
        id: record_edit_or_delete_id,
        avatar: record_cat_add_avatar,
        name: record_cat_add_name
      });
      if (res.code == '200') {

        yield put({
          type: 'save', payload: {
            record_cat_add_name: '',
            record_cat_add_avatar: '',
          }
        });

        Taro.eventCenter.trigger(EVENT_RECORD_CAT_ACTION, res.data, 0);
        //退回上个页面
        Taro.navigateBack();
      }
    },

    //删除档案袋
    * record_cat_delete(_, {call, select}) {
      const {record_edit_or_delete_id} = yield select(state => state.record);
      const res = yield call(recordApi.deleteRecordCat, {id: record_edit_or_delete_id});
      if (res.code == '200') {
        showToast(res.msg);
        Taro.eventCenter.trigger(EVENT_RECORD_CAT_ACTION, record_edit_or_delete_id, -1);
      }
    },

    //移入档案袋
    * record_move_cat(_, {call, select}) {
      const {record_edit_or_delete_id, record_move_cat_cid} = yield select(state => state.record);
      const res = yield call(recordApi.moveRecordCat, {
        id: record_edit_or_delete_id,
        cid: record_move_cat_cid,
      });
      if (res.code == '200') {
        showToast(res.msg);
        Taro.navigateBack();
        //重新请求所有的档案袋和档案袋里面的数据接口
        Taro.eventCenter.trigger(EVENT_RECORD_CAT_ACTION, record_edit_or_delete_id);
      }
    },

    //移出档案袋
    * record_move_out_cat(_, {call, select}) {
      const {record_edit_or_delete_id, record_move_cat_cid} = yield select(state => state.record);
      const res = yield call(recordApi.moveRecordCat, {
        id: record_edit_or_delete_id,
        cid: record_move_cat_cid,
      });
      if (res.code == '200') {
        showToast(res.msg);
        Taro.navigateBack();
        //重新请求所有的档案袋和档案袋里面的数据接口
        Taro.eventCenter.trigger(EVENT_RECORD_CAT_ACTION, record_edit_or_delete_id);
      }
    },

  },
  reducers: {
    save(state, {payload}) {
      return {...state, ...payload};
    },
  },

};
