import Taro from '@tarojs/taro';
import * as api from "./service";
import {getRecord} from "../../../utils/common";

export default {
  namespace: 'synastryDetail',
  state: {
    rid1: '',
    rid2: '',
    data: '',
    // list:[],
  },
  effects: {
    * detail(_, {call, put, select}) {
      const {rid1, rid2} = yield select(state => state.synastryDetail);
      const res = yield call(
        api.get_synastry_detail,
        {
          id1: rid1,
          id2: rid2,
          chart: 'synastry'
        }
      );
      if (res && res.code == '200') {
        yield put({
          type: 'save', payload: {
            data: res.data
          }
        });

        //保存合盘数据到本地
        let list = [];
        let cache = Taro.getStorageSync('store_synatry_list');
        if (cache) {
          list = cache;
        }
        res.data.rid1 = rid1;
        res.data.rid2 = rid2;
        res.data.name1 = getRecord(rid1).name;
        res.data.name2 = getRecord(rid2).name;

        list.push(res.data);
        Taro.setStorageSync('store_synatry_list', list);
      }
    }
    ,
  }
  ,
  reducers: {
    save(state, {payload}) {
      return {...state, ...payload};
    }
  }

}
;
