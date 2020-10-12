import * as articleApi from './service';
import Taro from '@tarojs/taro';

export default {
  namespace: 'tabArticle',
  state: {
    cid: '',//文章分类id
    // list: Taro.getStorageSync('store_article_category_list')?(Taro.getStorageSync('store_list_' + (Taro.getStorageSync('store_article_category_list') && Taro.getStorageSync('store_article_category_list').length > 0) ? Taro.getStorageSync('store_article_category_list')[0] : '')):[],//文章分类列表

    categories: Taro.getStorageSync('store_article_category_list'),//所有的文章分类
    category_index: 0,//当前选中的文章tab index

    page: 1,
    list: [],//列表数据
    loading: 0,//0：不显示加载中；1：显示加载中；2：显示没有更多了；
  },
  effects: {
    * categories(_, {call, put}) {
      const res = yield call(articleApi.categories, {});
      if (res.code == '200') {
        yield put({
          type: 'save',
          payload: {
            categories: res.data,
            cid: res.data[0].id,
          }
        });
        //保存文章的所有分类数据到本地
        Taro.setStorageSync('store_article_category_list', res.data);

        //请求文章列表，这样第一个tab 就不为空了
        yield put({type: 'articles'});

      }
    },
    * articles(_, {call, put, select}) {
      const {cid, page, list} = yield select(state => state.tabArticle);

      //是否是显示加载提示
      let is_show_loading = false;
      if (page == 1) {
        is_show_loading = true;
      }

      const res = yield call(articleApi.articles, {
        page,
        cid,
      }, is_show_loading);
      if (res && res.code == '200') {
        //判断loading状态
        let loading = 0;
        //没有更多了
        // if (Number(res.data.last_page) <= Number(res.data.current_page)) {
        //   loading = 2;
        // }
        if (Number(res.data.last_page) == Number(res.data.current_page)) {//没有更多了
          loading = 2;
        } else if (Number(res.data.last_page) > Number(res.data.current_page)) {//显示加载中
          loading = 1;
        }
        //设置数据
        let list_all = [];
        console.log('page=' + page);
        if (page == 1) {//当请求第一页数据时，直接赋值
          list_all = res.data.data;
        } else {//加载更多，组装数据
          list_all = list.concat(res.data.data);
        }

        //保存数据
        yield put({
          type: 'save', payload: {
            list: list_all,
            loading: loading,
          }
        });

        //保存分类列表数据到本地
        Taro.setStorageSync('store_list_' + cid, list_all);
      }
    },
  },
  reducers: {
    save(state, {payload}) {
      return {...state, ...payload};
    },
  },
};
