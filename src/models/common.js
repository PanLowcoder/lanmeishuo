import Taro from '@tarojs/taro';
import * as commonApi from "./service";

export default {
    namespace: 'common',
    state: {
        access_token: Taro.getStorageSync('access_token'),
        id: Taro.getStorageSync('id'),
        has_self_recode: Taro.getStorageSync('has_self_recode'),
        uc_id: Taro.getStorageSync('uc_id'),
        mobile: Taro.getStorageSync('mobile'),

        open_id: Taro.getStorageSync('open_id'),

        selected_records: [],//选择的档案列表
        selected_astrologers: [],//选择的占星师列表

        wechat_sign_data: {},//微信签名


    },

    effects: {
        * get_wechat_sign(_, { call, put, select }) {
            const { rid, day_param_time } = yield select(state => state.common);
            const res = yield call(commonApi.get_wechat_sign,
                {}
            )
                ;
            if (res && res.code == '200') {
                yield put({
                    type: 'save', payload: {
                        wechat_sign: res.data
                    }
                });
            } else {

            }
        },
    },

    reducers: {
        save(state, { payload }) {
            return { ...state, ...payload };
        },
    },

};
