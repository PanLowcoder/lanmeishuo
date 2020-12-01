import * as homeApi from './service';
import Taro from '@tarojs/taro';

import { ossUrl } from "../../../config";

const icon_Astrolable = ossUrl + 'upload/images/home/astrolabe.png';
const icon_Combine = ossUrl + 'upload/images/home/Combine.png';
const icon_Correction = ossUrl + 'upload/images/home/Correction.png';
const icon_Diary = ossUrl + 'upload/images/home/Diary.png';
const icon_Prediction = ossUrl + 'upload/images/home/prediction.png';

export default {
  namespace: 'tabHome',
  state: {
    data: Taro.getStorageSync('store_home_data'),
    tabs: [
      {
        title: '星盘',
        url: icon_Astrolable,
        path: '/pages/astro/detail/index'
      },
      {
        title: '合盘',
        url: icon_Combine,
        path: '/pages/synastry/synastryList/index'
      },
      {
        title: '预测',
        url: icon_Prediction,
        path: '/pages/synastry/synastryList/index'
      },
      {
        title: '日记',
        url: icon_Diary,
        path: '/pages/synastry/synastryList/index'
      },

      {
        title: '生时校正',
        url: icon_Correction,
        path: '/pages/synastry/synastryList/index'
      }
    ]
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
