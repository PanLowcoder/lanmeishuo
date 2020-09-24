import Taro from '@tarojs/taro';
import * as login from './service';
import * as recordApi from "../tabs/tabRecord/service";
import {isWeiXin} from '../../utils/common'
import {connect} from "@tarojs/redux";

export default {
  namespace: 'login',
  state: {
    mobile: '',
    code: '',
    access_token: '',
    smsText: '发送验证码',
    sending: 0,//0：获取验证码；1：**秒后重发；2：重新获取；
    smsTime: 60,
    callback: '',

    wechat_user_info: '',
  },

  effects: {
    * login(_, {call, put, select}) {
      const {callback, code, mobile} = yield select(state => state.login);
      const res = yield call(login.login, {code, tel: mobile});
      if (res.code == '200') {
        Taro.setStorageSync('id', res.data.id);
        Taro.setStorageSync('has_self_recode', res.data.has_self_recode);
        Taro.setStorageSync('access_token', res.data.user_access_token);
        Taro.setStorageSync('uc_id', res.data.uc_id);
        Taro.setStorageSync('mobile', mobile);

        yield put({
          type: 'common/save',
          payload: {
            id: res.data.id,
            has_self_recode: res.data.has_self_recode,
            access_token: res.data.user_access_token,
            uc_id: res.data.uc_id,
            mobile: mobile,
          },
        });

        yield put({
          type: 'save',
          payload: {
            access_token: res.data.user_access_token,
            id: res.data.id,
            has_self_recode: res.data.has_self_recode,
            uc_id: res.data.uc_id,
            mobile: mobile,
          },
        });

        yield put({
          type: 'tabRecord/recordes'
        });
        //请求文章列表，这样第一个tab 就不为空了
        yield put({type: 'articles'});


        //获取档案列表
        const res1 = yield call(recordApi.recordes, {});
        if (res1 && res1.code == '200') {
          //保存档案列表数据到本地
          Taro.setStorageSync('store_record_list', res1.data);
        }
        //
        // //获取档案袋列表
        const res2 = yield call(recordApi.cats, {});
        if (res2 && res2.code == '200') {
          //保存档案袋列表数据到本地
          Taro.setStorageSync('store_cat_list', res2.data);
        }


        Taro.showToast({
          title: '登录成功，欢迎回来～～～',
          icon: 'none',
        });

        let url = '/pages/tabs/tabHome/index';
        if (res.data.has_self_recode == 0) {
          url = '/pages/record/recordAdd/index?type=2'
        }

        setTimeout(() => {
          if (Taro.getEnv() === Taro.ENV_TYPE.WEB) {
            if (callback) {
              Taro.redirectTo({url: callback});
            } else {
              Taro.redirectTo({url: url});
            }
          } else {
            Taro.switchTab({url: url});
          }
        }, 1000);
      }
    },

    * sendSms(_, {call, put, select}) {
      const {mobile} = yield select(state => state.login);
      const res = yield call(login.getSms, {tel: mobile});
      if (res.code == '200') {
        yield put({type: 'save', payload: {sending: 1, erroMessage: ''}});
      } else {
        yield put({type: 'save', payload: {sending: 2, erroMessage: res.error && res.error.message}});
      }
    },

    //微信登录
    * wechat(_, {call, put, select}) {
      const {wechat_user_info} = yield select(state => state.login);
      const res = yield call(login.wechat, {userinfo: wechat_user_info});
      if (res.code == '200') {

        let wechat_user_info_obj = JSON.parse(wechat_user_info);
        Taro.setStorageSync('id', res.data.id);
        Taro.setStorageSync('has_self_recode', res.data.has_self_recode);
        Taro.setStorageSync('access_token', res.data.user_access_token);
        Taro.setStorageSync('uc_id', res.data.uc_id);
        Taro.setStorageSync('open_id', wechat_user_info_obj.openid);//保存用户的open_id


        yield put({
          type: 'common/save',
          payload: {
            id: res.data.id,
            has_self_recode: res.data.has_self_recode,
            access_token: res.data.user_access_token,
            uc_id: res.data.uc_id,
            open_id: wechat_user_info_obj.openid,
          },
        });

        yield put({
          type: 'save',
          payload: {
            access_token: res.data.user_access_token,
            id: res.data.id,
            has_self_recode: res.data.has_self_recode,
            uc_id: res.data.uc_id,
          },
        });

        yield put({
          type: 'tabRecord/recordes'
        });
        //请求文章列表，这样第一个tab 就不为空了
        yield put({type: 'articles'});


        //获取档案列表
        const res1 = yield call(recordApi.recordes, {});
        if (res1 && res1.code == '200') {
          //保存档案列表数据到本地
          Taro.setStorageSync('store_record_list', res1.data);
        }
        //
        // //获取档案袋列表
        const res2 = yield call(recordApi.cats, {});
        if (res2 && res2.code == '200') {
          //保存档案袋列表数据到本地
          Taro.setStorageSync('store_cat_list', res2.data);
        }


        Taro.showToast({
          title: '登录成功',
          icon: 'none',
        });

        let url = '/pages/tabs/tabHome/index';
        if (res.data.has_self_recode == 0) {
          url = '/pages/record/recordAdd/index?type=2'
        }

        setTimeout(() => {
          if (Taro.getEnv() === Taro.ENV_TYPE.WEB) {
            Taro.redirectTo({url: url});
          } else {
            Taro.switchTab({url: url});
          }
        }, 1000);
      }
    },
  },

  reducers: {
    save(state, {payload: data}) {
      return {...state, ...data};
    },
  },

};
