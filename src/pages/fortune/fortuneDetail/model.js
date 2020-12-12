import Taro, {Events} from '@tarojs/taro';
import * as fortuneApi from "./service";
import {getSelfRecord, fmtDate} from "../../../utils/common";

export default {
  namespace: 'fortuneDetail',
  state: {
    tabs: [
      '日运',
      '月运',
      '年运',
    ],
    current_tab: 0,//当前选中的tab栏，0：日运；1：月运；2：年运；
    records: [],//选中的档案列表
    details: [],//详情列表
    nums: [
      {
        name: '健康',
        color: '#f688a5',
        num: 0,
      },
      {
        name: '事业',
        color: '#9ce5e9',
        num: 0,
      },
      {
        name: '爱情',
        color: '#f7ba6c',
        num: 0,
      },
      {
        name: '财富',
        color: '#a29cf2',
        num: 0,
      },
    ],//详情里，分值列表
    rid: getSelfRecord().id,//请求的档案
    day_calendar_data: '',//日运-日历请求结果
    day_detail: '',//日运请求结果
    month_detail: '',//月运请求结果
    year_detail: '',//年运请求结果
    day_result_time: [],//日运返回结果time区间
    day_result_time_range: '',//日运返回结果time_range区间
    month_result_time: [],//月运返回结果time区间
    month_result_time_range: '',//月运返回结果time_range区间
    year_result_time: [],//年运返回结果time区间
    year_result_time_range: '',//年运返回结果time_range区间
    day_param_time: new Date(),//日运参数，请求的时间戳
    month_param_year: new Date().getFullYear(),//月运参数，选择的年
    month_param_month: (new Date().getMonth() + 1),//月运参数，选择的月
    year_param_year: new Date().getFullYear(),//年运参数，选择的年
    error: '',//网络请求错误信息
    is_show_day_modal: false,//是否显示日运订购alert
  },
  effects: {
    * day_calendar_request(_, {call, put, select}) {
      const {rid, day_param_time} = yield select(state => state.fortuneDetail);
      const res = yield call(
        fortuneApi.fortune_day_calendar,
        {
          rid: rid,
          time: fmtDate(day_param_time)
        }
      );
      if (res && res.code == '200') {
        yield put({
          type: 'save', payload: {
            day_calendar_data: res.data
          }
        });
        return res.data;
      }
    }
    ,
    * day_detail(_, {call, put, select}) {

      const {rid, day_param_time} = yield select(state => state.fortuneDetail);
      // this.log('fortune detail model day_detail rid =' + rid + ',day_param_time=' + day_param_time);
      const res = yield call(
        fortuneApi.fortune_day_detail,
        {
          rid: rid,
          time: fmtDate(day_param_time)
        }
      );
      if (res && res.code == '200') {
        yield put({
          type: 'save', payload: {
            day_detail: res.data,
            is_show_day_modal: res.data.hasOwnProperty('forbid_name') ? false : true,
          }
        });
        Taro.eventCenter.trigger('FortuneDayCalendar', day_param_time, res.data.fortune);
      } else {
        if (res.msg) {
          yield put({
            type: 'save', payload: {
              error: res.msg
            }
          });
        }
      }
    }
    ,
    * month_detail(_, {call, put, select}) {
      const {rid, month_param_year, month_param_month} = yield select(state => state.fortuneDetail);
      const res = yield call(
        fortuneApi.fortune_month_detail,
        {
          rid: rid,
          year: month_param_year,
          month: month_param_month,
        }
      );

      if (res && res.code == '200') {
        yield put({
          type: 'save', payload: {
            month_detail: res.data,
            month_result_time_range: res.data.time_range,
            month_result_time: res.data.time,
          }
        });
        Taro.eventCenter.trigger('FortuneMonthOrYearCalendar', res.data.time, res.data.time_range);
      } else {
        if (res.msg) {
          yield put({
            type: 'save', payload: {
              error: res.msg
            }
          });
        }
      }
    }
    ,

    * year_detail(_, {call, put, select}) {
      const {rid, year_param_year} = yield select(state => state.fortuneDetail);
      const res = yield call(
        fortuneApi.fortune_year_detail,
        {
          rid: rid,
          year: year_param_year
        }
      );


      if (res && res.code == '200') {
        yield put({
          type: 'save', payload: {
            year_detail: res.data,
            year_result_time_range: res.data.time_range,
            year_result_time: res.data.time,
          }
        });
        // this.log('Taro.eventCenter.trigger(\'FortuneMonthOrYearCalendar\')');
        Taro.eventCenter.trigger('FortuneMonthOrYearCalendar', res.data.time, res.data.time_range);
      } else {
        if (res.msg) {
          // this.log('model msg=' + res.msg);
          yield put({
            type: 'save', payload: {
              error: res.msg
            }
          });
        }
      }
    }
    ,
  },
  reducers: {
    save(state, {payload}) {
      return {...state, ...payload};
    }
  }

};
