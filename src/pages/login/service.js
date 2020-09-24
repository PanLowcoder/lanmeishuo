import Request from '../../utils/request';

// 手机用户登录
export const login = data => Request({
  url: '/api/user/login/mobile',
  method: 'POST',
  data,
});

// 获取手机验证码
export const getSms = data => Request({
  url: '/api/user/login/get_code',
  method: 'POST',
  data,
});

// 微信登录
export const wechat = data => Request({
  url: '/api/user/login/wechat',
  method: 'POST',
  data,
});


