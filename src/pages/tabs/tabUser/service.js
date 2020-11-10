import Request from '../../../utils/request';

//请求-tab我的-页面数据
export const get_personal_info = (data, loading) => Request({
  url: '/api/user/personal',
  method: 'GET',
  data,
}, false);

//请求-个人中心-页面数据
export const get_user_center = (data, loading) => Request({
  url: '/api/user/info',
  method: 'GET',
  data,
}, true);

//个人中心页面-修改性别
export const change_sex = (data, loading) => Request({
  url: '/api/user/userinfo/save_sex',
  method: 'POST',
  data,
}, true);

//修改昵称页面-修改昵称
export const change_name = (data, loading) => Request({
  url: '/api/user/info/alter_name',
  method: 'PUT',
  data,
}, true);

//修改手机号页面-修改手机号
export const change_tel = (data, loading) => Request({
  url: '/api/user/info/change_tel',
  method: 'PUT',
  data,
}, true);

//个人中心页面-修改头像地址
export const put_avatar_url = (data, loading) => Request({
  url: '/api/user/info/alter_avatar',
  method: 'PUT',
  data,
}, true);

