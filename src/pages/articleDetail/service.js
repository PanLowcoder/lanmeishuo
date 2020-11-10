import Request from '../../utils/request';

// 获取文章详情
export const getArticleDetail = params => Request({
  url: '/api/article/index/details',
  method: 'GET',
  data: params,
  // loading:true,
});

// 获取文章评论列表
export const getArticleComments = (data, loading) => Request({
  url: '/article/index/comment_lists',
  method: 'GET',
  data: data,
}, loading);

//点赞
export const good = params => Request({
  url: '/article/index/good',
  method: 'POST',
  data: params,
});

//收藏
export const collect = params => Request({
  url: '/api/article/index/collect',
  method: 'POST',
  data: params,
});

//评论点赞
export const comment_good = params => Request({
  url: '/article/index/comment_good',
  method: 'POST',
  data: params,
});


//评论
export const comment = params => Request({
  url: '/article/index/comment',
  method: 'POST',
  data: params,
});


//回复
export const reply = params => Request({
  url: '/article/index/reply',
  method: 'POST',
  data: params,
});

