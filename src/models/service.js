import Request from '../utils/request';

//获取微信js参数
export const get_wechat_sign = data => Request({
  url: '/web/wap/wechat_get_sign',
  method: 'POST',
  data,
});

