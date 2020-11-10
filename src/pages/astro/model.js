import * as astroApi from "./service";
import {customTime, getSelfRecord, showToast} from "../../utils/common";
import {
  ASTRO_SYNASTRY_TABS,
  ASTRO_TABS,
  EVENT_COMMON_LIST_ADD,
  EVENT_COMMON_LIST_DELETE,
  EVENT_COMMON_LIST_UPDATE,
  LIST_ITEM_TYPES
} from "../../utils/constants";
import Taro from "@tarojs/taro";
import {ASTRO_SYNASTRY_TYPES, ASTRO_TYPES, BOTTOM_LETF_BTN_TYPE} from "../../components/Astro/CanvasView";

export default {
  namespace: 'astro',
  state: {

    synastry_rid1: '',//合盘档案1
    synastry_rid2: '',//合盘档案2
    synastry_data: '',//合盘数据
    synastry_tab_index: 0,//合盘-星盘当前选中的盘

    rid: getSelfRecord().id,//默认的档案id
    tid: 1,//当前选中的类型：1：现代；2：古典；3：特殊；
    tab_index: 2,//星盘当前选中的index
    count_of_note: '',//笔记的数量
    data: '',
    single_or_double_status: BOTTOM_LETF_BTN_TYPE.SINGLE,//单盘或者双盘

    setting_data: '',//星盘配置data数据

    predict_record: '',//预测页面-record
    predict_data: '',//预测页面-请求返回的数据

    horoscope_record: getSelfRecord(),//八字页面-record
    horoscope_time_type: '0',//时间模式：0：北京时间；1：真太阳时；
    horoscope_time_start: '0',//日辰初始：23：23点；0：24点；
    horoscope_data: '',//八字页面-请求返回的数据

    note_type: -1,
    divination_id: '',
    index_of_list: '',
    note_action: -1,//笔记操作：-1：删除；0：编辑；1：新增；

    timezone: 8,//时区 TODO 获取客户端时区
    date: customTime(new Date(), 4, true),
    time: customTime(new Date(), 6, true),

    is_refresh_astro: false,//是否刷新星盘

  },
  effects: {

    //请求合盘数据
    * get_synastry_astro_data(_, {call, put, select}) {

      const {synastry_rid1, synastry_rid2, tid, synastry_tab_index, timezone, date, time} = yield select(state => state.astro);
      let tab_index = synastry_tab_index
      let params = {};
      if (
        ASTRO_SYNASTRY_TYPES.SYNASTRY_1 == tab_index ||
        ASTRO_SYNASTRY_TYPES.SYNASTRY_2 == tab_index ||
        ASTRO_SYNASTRY_TYPES.COMPOSITE == tab_index ||
        ASTRO_SYNASTRY_TYPES.DAVISON == tab_index ||
        ASTRO_SYNASTRY_TYPES.MARKS_1 == tab_index ||
        ASTRO_SYNASTRY_TYPES.MARKS_2 == tab_index
      ) {
        params = {
          chart: ASTRO_SYNASTRY_TABS[synastry_tab_index].params,
          id1: (
            ASTRO_SYNASTRY_TYPES.SYNASTRY_1 == tab_index ||
            ASTRO_SYNASTRY_TYPES.MARKS_1 == tab_index
          ) ? synastry_rid1 : synastry_rid2,
          id2: (
            ASTRO_SYNASTRY_TYPES.SYNASTRY_1 == tab_index ||
            ASTRO_SYNASTRY_TYPES.MARKS_1 == tab_index
          ) ? synastry_rid2 : synastry_rid1,
          tid: tid,
        }
      } else if (ASTRO_SYNASTRY_TYPES.NATAL_1 == tab_index) {
        params = {
          chart: ASTRO_SYNASTRY_TABS[tab_index].params,
          id: synastry_rid1,
          tid: tid,
        }
      } else if (ASTRO_SYNASTRY_TYPES.NATAL_2 == tab_index) {
        params = {
          chart: ASTRO_SYNASTRY_TABS[tab_index].params,
          id: synastry_rid2,
          tid: tid,
        }
      } else {
        params = {
          chart: ASTRO_SYNASTRY_TABS[tab_index].params,
          datetime: date + ' ' + time,
          id1: (
            ASTRO_SYNASTRY_TYPES.SYNASTRY_THIRDPROGRESSED_2 == tab_index ||
            ASTRO_SYNASTRY_TYPES.SYNASTRY_PROGRESSIONS_2 == tab_index
          ) ? synastry_rid2 : synastry_rid1,
          id2: (
            ASTRO_SYNASTRY_TYPES.SYNASTRY_THIRDPROGRESSED_2 == tab_index ||
            ASTRO_SYNASTRY_TYPES.SYNASTRY_PROGRESSIONS_2 == tab_index
          ) ? synastry_rid1 : synastry_rid2,
          tid: tid,
          timezone
        }
      }
      const res = yield call(astroApi.get_astro_data, params);
      
      if (res && res.code == '200') {
        yield put({
          type: 'save', payload: {
            synastry_data: res.data
          }
        });
      }
    },

    //请求星盘数据
    * get_astro_data(_, {call,put, select}) {

      const {rid, tid, tab_index, timezone, date, time, single_or_double_status} = yield select(state => state.astro);
      let params = {};
      switch (parseInt(tab_index)) {
        case ASTRO_TYPES.NOW: {//TODO 获取定位
          params = {
            chart: ASTRO_TABS[tab_index].params,
            tid: tid,
            datetime: date + ' ' + time,
            latitude: '39.89759278849565',
            longitude: '116.5463442635445',
            timezone
          }
          break;
        }
        case ASTRO_TYPES.NATAL: {
          params = {
            chart: ASTRO_TABS[tab_index].params,
            id: rid,
            tid: tid,
          }
          break;
        }

        default: {
          params = {
            chart: ASTRO_TABS[tab_index].params + (single_or_double_status == BOTTOM_LETF_BTN_TYPE.DOUBLE ? 'vsnatal' : ''),
            datetime: date + ' ' + time,
            id: rid,
            tid: tid,
            timezone
          }

        }
      }
      const res = yield call(astroApi.get_astro_data,params);
       console.log(res)
      if (res && res.code == '200') {
        yield put({
          type: 'save', payload: {
            data: res.data
          }
        });
      }
    },

    //请求笔记数量
    * get_note_count(_, {call, put, select}) {
      const {rid} = yield select(state => state.astro);
      const res = yield call(astroApi.get_note_count, {
        rid: rid,
      });
      if (res && res.code == '200') {
        yield put({
          type: 'save', payload: {
            count_of_note: res.data
          }
        });
      }
    },
    //请求星盘配置
    * get_astro_setting(_, {call, put, select}) {
      const {tid, tab_index} = yield select(state => state.astro);
      const res = yield call(astroApi.get_astro_setting, {
        tid: tid,
        chart: ASTRO_TABS[tab_index].params,
      });
      if (res && res.code == '200') {
        yield put({
          type: 'save', payload: {
            setting_data: res.data
          }
        });
      }
    },
    //请求本命预测数据
    * get_predict_data(_, {call, put, select}) {
      const {predict_record} = yield select(state => state.astro);
      const res = yield call(astroApi.get_predict_data, {
        chart: 'natal',
        id: predict_record.id,
      });
      if (res && res.code == '200') {
        yield put({
          type: 'save',
          payload: {
            predict_data: res.data
          }
        });
        return res.data;
      }
    },
    //请求八字数据
    * horoscope(_, {call, put, select}) {
      const {horoscope_record, horoscope_time_type, horoscope_time_start} = yield select(state => state.astro);
      const res = yield call(astroApi.get_horoscope_data, {
        id: horoscope_record.id,
        time_start: horoscope_time_start,
        time_type: horoscope_time_type,
      });
      if (res && res.code == '200') {
        yield put({
          type: 'save',
          payload: {
            horoscope_data: res.data
          }
        });
      }
    },
  },
  //删除备注
  * get_note_data(_, {call, put, select}) {
    const {rid, note_action, note_type, divination_id, note_item, index_of_list} = yield select(state => state.astro);
    let res = {};

    if (note_action == -1) {//删除备注
      if (note_type == LIST_ITEM_TYPES.ITEM_ASTRO_NOTE) {
        res = yield call(astroApi.delete_astro_note, {
          id: note_item.id,
        });
      } else if (note_type == LIST_ITEM_TYPES.ITEM_DIVINATION_NOTE) {
        res = yield call(astroApi.delete_divination_note, {
          id: note_item.id,
          did: divination_id,
        });
      }
    } else if (note_action == 0) {//编辑备注
      if (note_type == LIST_ITEM_TYPES.ITEM_ASTRO_NOTE) {
        res = yield call(astroApi.edit_astro_note, {
          id: note_item.id,
          content: note_item.content,
          rid: rid,
        });
      } else if (note_type == LIST_ITEM_TYPES.ITEM_DIVINATION_NOTE) {
        res = yield call(astroApi.edit_divination_note, {
          id: note_item.id,
          did: divination_id,
          content: note_item.content,
        });
      }
    } else if (note_action == 1) {//新增备注
      if (note_type == LIST_ITEM_TYPES.ITEM_ASTRO_NOTE) {
        res = yield call(astroApi.add_astro_note, {
          from: note_item.from,
          content: note_item.content,
          rid: rid,
        })
        ;
      } else if (note_type == LIST_ITEM_TYPES.ITEM_DIVINATION_NOTE) {
        res = yield call(astroApi.add_divination_note, {
          did: divination_id,
          content: note_item.content,
        });
      }
    }


    if (res && res.code == '200') {

      if (note_action == -1) {//删除成功
        showToast(res.msg);
        //发送消息，更新list ui
        Taro.eventCenter.trigger(EVENT_COMMON_LIST_DELETE, index_of_list);
      } else if (note_action == 0) {//编辑成功
        //发送消息，更新list ui
        Taro.eventCenter.trigger(EVENT_COMMON_LIST_UPDATE, index_of_list, note_item);
        Taro.navigateBack();
      } else if (note_action == 1) {//新增成功
        //发送消息，更新list ui
        Taro.eventCenter.trigger(EVENT_COMMON_LIST_ADD, index_of_list, note_item);
        Taro.navigateBack();
      }
      yield put({
        type: 'save', payload: {}
      });
      return res
    }
  },

  reducers: {
    save(state, {payload}) {
      console.log(payload)
      return {...state, ...payload};
    },
  },

};
