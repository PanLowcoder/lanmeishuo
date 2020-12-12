//静态图片资源
import { ossUrl } from "../../../config";

import { LIST_ITEM_TYPES } from "../../../utils/constants";
import * as userApi from "./service";
import Taro from "@tarojs/taro";
import { actionNavBack, showToast } from "../../../utils/common";

const img_grid_function_0 = ossUrl + 'upload/images/user/me_bt_order.png';
const img_grid_function_1 = ossUrl + 'upload/images/user/me_bt_like.png';
const img_grid_function_2 = ossUrl + 'upload/images/user/me_bt_favorites.png';
const img_grid_function_3 = ossUrl + 'upload/images/user/me_bt_classroom.png';
const img_grid_function_4 = ossUrl + 'upload/images/user/me_bt_luckystar.png';
const img_grid_function_5 = ossUrl + 'upload/images/user/me_bt_questions.png';
const img_grid_function_6 = ossUrl + 'upload/images/user/me_bt_birthtime.png';
const img_grid_function_7 = ossUrl + 'upload/images/user/me_bt_diary.png';

const img_list_function_0 = ossUrl + 'upload/images/user/me_bt_wallet.png';
const img_list_function_1 = ossUrl + 'upload/images/user/me_bt_certification.png';
const img_list_function_2 = ossUrl + 'upload/images/user/me_bt_examination.png';
const img_list_function_3 = ossUrl + 'upload/images/user/me_bt_share.png';
const img_list_function_4 = ossUrl + 'upload/images/user/me_bt_score.png';
const img_list_function_5 = ossUrl + 'upload/images/user/me_bt_setup.png';

export default {
    namespace: 'user',
    state: {
        user: '',//tab我的页面-数据
        data: '',//个人中心-数据
        avatar: '',//头像

        code: '',//修改手机号页面-验证码
        old_tel: '',//修改手机号页面-旧的手机号
        new_tel: '',//修改手机号页面-新的手机号


        //常用功能
        gridItems: [
            {
                txt: '我的订单',
                img: img_grid_function_0,
                num: 0,
                link: '/pages/emptyPage/index',
                type: 2,
            },
            {
                txt: '我的点赞',
                img: img_grid_function_1,
                num: 0,
                link: '/minePages/likeOrCollect/index?type=' + LIST_ITEM_TYPES.ITEM_ZAN,
                type: 3,
            },
            {
                txt: '我的收藏',
                img: img_grid_function_2,
                num: 0,
                link: '/minePages/likeOrCollect/index?type=' + LIST_ITEM_TYPES.ITEM_COLLECT,
                type: 9,
            },
            {
                txt: '我的课程',
                img: img_grid_function_3,
                num: 1,
                link: '/pages/emptyPage/index',
                type: 8,
            },
            {
                txt: '幸运星',
                img: img_grid_function_4,
                num: 0,
                link: '/pages/emptyPage/index',

            },
            {
                txt: '我的提问',
                img: img_grid_function_5,
                num: 0,
                link: '/pages/emptyPage/index',
            },
            {
                txt: '生时校正',
                img: img_grid_function_6,
                num: 0,
                link: '/pages/emptyPage/index',
            },
            {
                txt: '运势日记',
                img: img_grid_function_7,
                num: 1,
                link: '/pages/emptyPage/index',
            }

        ],

        //我的钱包、认证、考试等
        astrologerItems: [
            {
                txt: '我的钱包',
                img: img_list_function_0,
                link: '/pages/emptyPage/index',
            },
            {
                txt: '我要认证',
                img: img_list_function_1,
                link: '/pages/emptyPage/index',
            },
            {
                txt: '我要考试',
                img: img_list_function_2,
                link: '/pages/emptyPage/index',
            },
            {
                txt: '分享给好友',
                img: img_list_function_3,
                link: '/pages/platform/balanceDetail/index',
            },
            {
                txt: '给蓝莓说评分',
                img: img_list_function_4,
                link: '/pages/platform/identifyPage/index',
            },
            {
                txt: '设置',
                img: img_list_function_5,
                link: '/minePages/setting/index',
            },
        ],
    },
    effects: {
        * get_personal_info(_, { call, put }) {
            const res = yield call(userApi.get_personal_info, {});
            if (res && res.code == '200') {
                yield put({
                    type: 'save', payload: {
                        user: res.data
                    }
                });
            }
        },
        * user_center(_, { call, put }) {
            const res = yield call(userApi.get_user_center, {});
            if (res && res.code == '200') {
                yield put({
                    type: 'save', payload: {
                        data: res.data
                    }
                });
                return res.data;
            }
        },
        * change_sex(_, { call, put, select }) {
            const { data } = yield select(state => state.user);
            const res = yield call(userApi.change_sex, {
                sex: data.sex == 1 ? 2 : 1
            });
            if (res && res.code == '200') {
                showToast('修改成功')
                let tmp = data;
                tmp.sex = data.sex == 1 ? 1 : 2;
                yield put({
                    type: 'save', payload: {
                        data: tmp
                    }
                });
                return res;
            }
        },
        * change_name(_, { call, put, select }) {
            const { data } = yield select(state => state.user);
            const res = yield call(userApi.change_name, {
                name: data.name
            });
            if (res && res.code == '200') {
                showToast(res.msg)
                // actionNavBack();
                let tmp = data;
                tmp.name = data.name;
                yield put({
                    type: 'save', payload: {
                        data: tmp
                    }
                });
            }
        },
        * change_tel(_, { call, put, select }) {
            const { code, new_tel, old_tel, data } = yield select(state => state.user);
            const res = yield call(userApi.change_tel, {
                code,
                old_tel,
                tel: new_tel,
            });
            if (res && res.code == '200') {
                Taro.showToast({
                    title: '修改成功',
                    icon: 'none',
                    mask: false,
                });
                // actionNavBack();
                let tmp = data;
                tmp.tel = new_tel;
                yield put({
                    type: 'save', payload: {
                        data: tmp
                    }
                });
            }
        },
        // * upload(_, { call, put, select }) {
        //     const { data, avatar } = yield select(state => state.user);
        //     const res = yield call(userApi.upload, {
        //         avatar: avatar
        //     });

        //     // if (res && res.code == '200') {
        //     //   Taro.showToast({
        //     //     title: '修改成功',
        //     //     icon: 'none',
        //     //     mask: false,
        //     //   });
        //     //   this.log(data);
        //     //   let tmp=data;
        //     //   tmp.sex = data.sex == 1 ? 1 : 2;
        //     //   this.log(tmp);
        //     //   yield put({
        //     //     type: 'save', payload: {
        //     //       data: tmp
        //     //     }
        //     //   });
        //     // }
        // },
    },
    reducers: {
        save(state, { payload }) {
            return { ...state, ...payload };
        },
    },

};
