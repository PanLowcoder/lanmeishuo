import Request from '../../../utils/request';

//获取文章的所有分类
export const categories = data => Request({
  url: '/api/article_category',
  method: 'GET',
  data,
});

//根据文章分类id和page，获取文章列表
export const articles = (data, loading) => Request({
  url: '/api/articles',
  method: 'GET',
  data,
}, loading);

