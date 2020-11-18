import Request from '../../utils/request';

//星盘接口
export const get_astro_data = data => Request({
  url: '/api/v2/astro/data',
  method: 'GET',
  data,
}, true);

//获取日记数量接口
export const get_note_count = data => Request({
  url: '/api/recode/note/counts',
  method: 'POST',
  data,
}, true);

//获取星盘配置接口
export const get_astro_setting = data => Request({
  url: '/api/user/astroset/get',
  method: 'GET',
  data,
}, true);

//设置星盘配置接口
export const set_astro_setting = data => Request({
  url: '/api/user/astroset',
  method: 'POST',
  data,
}, true);

//还原星盘配置接口
export const set_astro_setting_original = data => Request({
  url: '/api/user/astroset',
  method: 'PUT',
  data,
}, true);

//本命预测接口
export const get_predict_data = data => Request({
  url: '/api/astro/natal/get_total_score',
  method: 'POST',
  data,
}, true);

//八字接口
export const get_horoscope_data = data => Request({
  url: '/api/v2/horoscope',
  method: 'GET',
  data,
}, true);

//新建星盘备注-接口
export const add_astro_note = data => Request({
  url: '/api/recode/note/add',
  method: 'POST',
  data,
}, true);

//编辑星盘备注-接口
export const edit_astro_note = data => Request({
  url: '/api/recode/note/edit',
  method: 'POST',
  data,
}, true);

//删除星盘备注-接口
export const delete_astro_note = data => Request({
  url: '/api/recode/note/del',
  method: 'POST',
  data,
}, true);

//新建卜卦备注-接口
export const add_divination_note = data => Request({
  url: '/api/note/divination',
  method: 'POST',
  data,
}, true);

//编辑卜卦备注-接口
export const edit_divination_note = data => Request({
  url: '/api/note/divination',
  method: 'PUT',
  data,
}, true);

//删除卜卦备注-接口
export const delete_divination_note = data => Request({
  url: '/api/note/divination',
  method: 'DELETE',
  data,
}, true);

