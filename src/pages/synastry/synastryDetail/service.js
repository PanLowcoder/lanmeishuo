import Request from '../../../utils/request';

//获取合盘详情
export const get_synastry_detail = data => Request({
  url: '/api/astro/synastry/get_with_score',
  method: 'GET',
  data,
});

//获取合盘关系详解
export const get_synastry_explain_detail = data => Request({
  url: '/api/astro/synastry/get_he_score',
  method: 'get',
  data,
});


