import Request from '../../utils/request';


//我的-收藏-地图-修改备注名
export const edit_remark_name = params => Request({
  url: '/api/v4/collect',
  method: 'PUT',
  data: params,
});

//地图-地址/命运之城-详情
export const map_detail = params => Request({
  url: '/api/v4/map_detail',
  method: 'GET',
  data: params,
});

//地图-地址/命运之城-收藏
export const map_address_collect = params => Request({
  url: '/api/v4/collect',
  method: 'POST',
  data: params,
});

//地图-地址/命运之城-取消收藏
export const map_address_cancel_collect = params => Request({
  url: '/api/v4/collect',
  method: 'DELETE',
  data: params,
});

//地图-地图线以及解锁状态
export const map_lines_lists = params => Request({
  url: '/api/v4/lines_lists',
  method: 'GET',
  data: params,
});

//地图-地图线以及解锁状态
export const map_pay_unlock = params => Request({
  url: '/api/v4/pay_unlock',
  method: 'POST',
  data: params,
});
