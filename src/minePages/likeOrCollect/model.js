import * as listApi from './service';
import Taro from '@tarojs/taro';

import { LIST_ITEM_TYPES } from "../../utils/constants";
import { getSelfRecord, showToast } from "../../utils/common";

export default {
    namespace: 'likeOrCollect',
    state: {
        type: LIST_ITEM_TYPES.ITEM_ZAN,//0:我的点赞列表；
        page: 1,
        list: [],//列表数据
        total: -1,
        loading: 0,//0：不显示加载中；1：显示加载中；2：显示没有更多了；
    },
    effects: {
        * lists(_, { call, put, select }) {
            const { type, page, list } = yield select(state => state.likeOrCollect);
            console.log('model type=' + type);
            //当请求第一页的时候显示加载提示
            let is_show_loading = false;
            if (page == 1) {
                is_show_loading = true;
            }

            let res = {};
            let empty_des = '';
            switch (Number(type)) {
                case LIST_ITEM_TYPES.ITEM_ZAN: {
                    res = yield call(listApi.get_my_good, {
                        page: page,
                    }, is_show_loading);
                    empty_des = '记得给你喜欢的文章及作者点赞哦~';
                    break;
                }

                case LIST_ITEM_TYPES.ITEM_COLLECT: {
                    res = yield call(listApi.get_my_collect, {
                        page: page,
                    }, is_show_loading);
                    console.log(res)
                    empty_des = '您还没有收藏，快去收藏吧';
                    break;
                }

            }
            if (res && (res.code == '200')) {
                //判断loading状态
                let loading = 0;
                //设置数据
                let list_all = [];
                if (Number(res.data.last_page) == Number(res.data.current_page)) {//没有更多了
                    loading = 2;
                } else if (Number(res.data.last_page) > Number(res.data.current_page)) {//显示加载中
                    loading = 1;
                }

                if (page == 1) {//当请求第一页数据时，直接赋值
                    list_all = res.data.data;
                } else {//加载更多，组装数据
                    list_all = list.concat(res.data.data);
                }

                //保存数据
                yield put({
                    type: 'save', payload: {
                        total: res.data.total,
                        list: list_all,
                        loading: loading,
                        empty_des: empty_des,
                    }
                });

                return list_all;
            }
        },
    },
    reducers: {
        save(state, { payload }) {
            return { ...state, ...payload };
        },
    },
};
