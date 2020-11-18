import Request from '../../utils/request';

//获取微信档案的数据
export const get_wechat_records = (data, loading) => Request({
  url: '/api/v7/wechat_recode',
  method: 'GET',
  data,
}, loading);

//新增档案
export const addRecord = data => Request({
  url: '/api/recode/index/add',
  method: 'POST',
  data,
});

//编辑档案
export const editRecord = data => Request({
  url: '/api/recode/index/edit',
  method: 'POST',
  data,
});

//删除档案
export const deleteRecord = data => Request({
  url: '/api/recode/index/del',
  method: 'POST',
  data,
});


// 获取档案袋背景列表
export const getCatBgList = data => Request({
  url: '/api/recode/cat/bg_lists',
  method: 'GET',
  data,
});

//新增档案袋
export const addCatBg = data => Request({
  url: '/api/recode/cat/add',
  method: 'POST',
  data,
});


//删除档案袋
export const deleteRecordCat = data => Request({
  url: '/api/recode/cat/del',
  method: 'POST',
  data,
});


//编辑档案袋
export const editRecordCat = data => Request({
  url: '/api/recode/cat/edit',
  method: 'POST',
  data,
});

//移入档案袋
export const moveRecordCat = data => Request({
  url: '/api/recode/index/cat',
  method: 'POST',
  data,
});

//移出档案袋
export const moveOutRecordCat = data => Request({
  url: '/api/recode/index/moveout_cat',
  method: 'POST',
  data,
});

