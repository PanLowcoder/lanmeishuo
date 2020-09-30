import * as homeApi from './service';
import Taro from '@tarojs/taro';

export default {
  namespace: 'tabHome',
  state: {
    data: Taro.getStorageSync('store_home_data'),
  },
  effects: {
    * load(_, { call, put }) {
      const res = yield call(homeApi.homepage, {});
      if (res.code == '200') {
        yield put({
          type: 'save',
          payload: {
            data: res.data,
          }
        });
        //保存首页数据到本地
        Taro.setStorageSync('store_home_data', res.data);

        return res.data;
      }
    },
  },
  reducers: {
    save(state, { payload }) {
      return { ...state, ...payload };
    },
  },
};
