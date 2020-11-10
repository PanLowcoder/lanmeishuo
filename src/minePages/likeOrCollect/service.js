import Request from '../../utils/request';
//获取我赞过的数据
export const get_my_good = (data, loading) => Request({
    url: '/api/user/info/like_me',
    method: 'POST',
    data,
}, loading);


//获取我收藏的文章数据
export const get_my_collect = (data, loading) => Request({
    url: '/api/user/info/comment_me',
    method: 'POST',
    data,
}, loading);


