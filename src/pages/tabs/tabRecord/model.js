import Taro from '@tarojs/taro';
import * as recordApi from "./service";

export default {
  namespace: 'tabRecord',
  state: {
    current_tab: 0,//当前选中的tab栏，0：档案；1：档案袋；
    record_list: Taro.getStorageSync('store_record_list'),//档案列表
    search_record_list: [],//本地档案搜索结果列表
    cat_list: Taro.getStorageSync('store_cat_list'),//档案袋列表
    cat_rids: Taro.getStorageSync('store_cat_rid_list'),//档案袋里面的ids
  },
  effects: {
    * recordes(_, {call, put}) {
      const res = yield call(recordApi.recordes, {});
      console.log(res)
      if (res && res.code == '200') {
        yield put({
          type: 'save', payload: {
            record_list: res.data
          }
        });
        //保存档案列表数据到本地
        Taro.setStorageSync('store_record_list', res.data);
        return res.data;
      }
    },
    //获取档案袋列表
    * cats(_, {call, put}) {
      const res = yield call(recordApi.cats, {});
      if (res && res.code == '200') {
        let cat_list = res.data;
        const res1 = yield call(recordApi.list_with_cat, {});
        if (res1 && res1.code == '200') {
          let cat_rids = res1.data;
          let count = 0;
          cat_list.forEach((item) => {
            cat_rids.forEach((item2) => {
              if (item.id == item2.cid) {
                count++;
              }
            })
            item.count = count;
          })
          yield put({
            type: 'save', payload: {
              cat_list: cat_list,
              cat_rids: cat_rids,
            }
          });
          //保存档案袋列表数据到本地
          Taro.setStorageSync('store_cat_list', cat_list);
          Taro.setStorageSync('store_cat_rid_list', cat_rids);

          return cat_list;
        }

      }
    },
  },
  reducers: {
    save(state, {payload}) {
      return {...state, ...payload};
    },
    // save(state, { payload }) {
    //   Taro.setStorageSync('items',[
    //     ...state.items,
    //     ...payload.items,
    //   ]);
    //   return { ...state, ...payload };
    // },
    deleteClothes(state, {payload}) {
      const {id} = payload;
      const items = state.items.filter((item) => item.product_id != id);
      // 设置衣袋小红点
      if (items.length > 0) {
        Taro.setStorageSync('items', items);
        Taro.setTabBarBadge({
          index: 1,
          text: String(items.length),
        })
      } else {
        Taro.removeStorageSync('items');
        Taro.removeTabBarBadge({
          index: 1,
        })
      }
      return {
        ...state, ...{
          items
        }
      };
    },
    init() {
      Taro.removeStorageSync('items');
      Taro.removeTabBarBadge({
        index: 1,
      })
      return {
        items: []
      };
    },
  },

};
