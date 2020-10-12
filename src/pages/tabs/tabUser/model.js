//静态图片资源
import { ossUrl } from "../../../config";

const img_grid_function_0 = ossUrl + 'wap/images/user/img_grid_function_0.png';
const img_grid_function_1 = ossUrl + 'wap/images/user/img_grid_function_1.png';
const img_grid_function_2 = ossUrl + 'wap/images/user/img_grid_function_2.png';
const img_grid_function_3 = ossUrl + 'wap/images/user/img_grid_function_3.png';

const img_grid_service_0 = ossUrl + 'wap/images/user/img_grid_service_0.png';
const img_grid_service_1 = ossUrl + 'wap/images/user/img_grid_serive_my_question.png';
const img_grid_service_2 = ossUrl + 'wap/images/user/img_grid_service_2.png';
const img_grid_service_3 = ossUrl + 'wap/images/user/img_grid_service_3.png';
// const icon_mine_message =ossUrl+ 'wap/images/user/icon_mine_message.png';

import { LIST_ITEM_TYPES } from "../../../utils/constants";
import * as userApi from "./service";
import Taro from "@tarojs/taro";
import { actionNavBack, showToast } from "../../../utils/common";

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
                link: '/pages/commonList/index?type=' + LIST_ITEM_TYPES.ITEM_ORDER,
                type: 2,
            },
            {
                txt: '我的点赞',
                img: img_grid_function_1,
                num: 0,
                link: '/pages/commonList/index?type=' + LIST_ITEM_TYPES.ITEM_ZAN,
                type: 3,
            },
            {
                txt: '我的收藏',
                img: img_grid_function_2,
                num: 0,
                link: '/pages/commonList/index?type=' + LIST_ITEM_TYPES.ITEM_COLLECT_ARTICLE + '&type2=' + LIST_ITEM_TYPES.ITEM_COLLECT_MAP,
                type: 9,
            },
            {
                txt: '我的课程',
                img: img_grid_function_3,
                num: 1,
                link: '/pages/commonList/index?type=' + LIST_ITEM_TYPES.ITEM_MY_COURSE,
                type: 8,
            },
            {
                txt: '幸运星',
                img: img_grid_service_0,
                num: 0,
                link: '/pages/commonList/index?type=' + LIST_ITEM_TYPES.ITEM_LUCKY,
            },
            {
                txt: '我的提问',
                img: img_grid_service_1,
                num: 0,
                link: '/pages/commonList/index?type=' + LIST_ITEM_TYPES.ITEM_QUESITON_MY,
            },
            {
                txt: '生时校正',
                img: img_grid_service_2,
                num: 0,
                link: '/pages/commonList/index?type=' + LIST_ITEM_TYPES.ITEM_RECTIFICATION,
            },
            {
                txt: '运势日记',
                img: img_grid_service_3,
                num: 1,
                link: '/pages/commonList/index?type=' + LIST_ITEM_TYPES.ITEM_FORTUNE_NOTE,
            }

        ],

        //我的钱包、认证、考试等
        astrologer_items: [
            {
                txt: '我的钱包',
                img: ossUrl + 'wap/images/user/icon_mine_wallet.png',
                link: '/pages/platform/balanceDetail/index',
            },
            {
                txt: '我要认证',
                img: ossUrl + 'wap/images/user/icon_mine_certification.png',
                link: '/pages/platform/identifyPage/index',
            },
            {
                txt: '我要考试',
                img: ossUrl + 'wap/images/user/icon_mine_examination.png',
                link: '/pages/platform/examineListPage/index',
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
