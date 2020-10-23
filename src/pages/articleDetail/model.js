import * as detailApi from './service';
import Taro from '@tarojs/taro';
import {REPORT_LIST} from "../../utils/constants";
import {showToast} from "../../utils/common";

export default {
  namespace: 'articleDetail',
  state: {
    articleId: '',
    comment_content: '',
    page: 1,//当前请求评论的页数
    commentId: '',//当前评论id（评论点赞的id，）
    report_selected_index: 0,//选中的举报index
  },
  effects: {
    * detail(_, {call, select}) {
      const {articleId} = yield select(state => state.articleDetail);
      const res = yield call(detailApi.getArticleDetail, {id: articleId});
      if (res.code == '200') {
        return res.data;
      }
    }
    ,
    * comment_list(_, {call, select}) {
      const {articleId, page} = yield select(state => state.articleDetail);
      const res = yield call(detailApi.getArticleComments, {page: page, aid: articleId},page>1?false:true);
      if (res.code == '200') {
        return res;
      }
    }
    ,
    * collect(_, {call, select}) {
      const {articleId} = yield select(state => state.articleDetail);
      const res = yield call(detailApi.collect, {id: articleId});
      if (res.code == '200') {
        return res;
      }
    }
    ,
    * good(_, {call, select}) {
      const {articleId} = yield select(state => state.articleDetail);
      const res = yield call(detailApi.good, {id: articleId});
      if (res.code == '200') {
        return res;
      }
    }
    ,
    * comment_good(_, {call, select}) {
      const {articleId, commentId} = yield select(state => state.articleDetail);
      const res = yield call(detailApi.comment_good, {id: articleId, commentid: commentId});
      if (res.code == '200') {
        return;
      }
    }
    ,
    * comment_complaint(_, {call, select}) {
      const {report_selected_index, commentId} = yield select(state => state.articleDetail);
      const res = yield call(detailApi.comment_complaint, {
        content: REPORT_LIST[report_selected_index],
        id: commentId,
        type: 1
      });
      if (res.code == '200') {
        showToast(res.msg)
        return res;
      }
    },

    * comment(_, {call, select}) {
      const {comment_content, articleId} = yield select(state => state.articleDetail);
      const res = yield call(detailApi.comment, {
        content: comment_content,
        id: articleId
      });
      if (res.code == '200') {
        return res;
      }
    },


  }
  ,
  reducers: {
    save(state, {payload}) {
      return {...state, ...payload};
    }
    ,
  }
  ,
}
;
