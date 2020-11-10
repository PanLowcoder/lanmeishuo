import Request from '../../../utils/request';

export const cats = data => Request({
  url: '/api/recode/cat/lists',
  method: 'POST',
  data,
});

export const list_with_cat = data => Request({
  url: '/api/recode/index/lists_with_cat',
  method: 'GET',
  data,
});

export const recordes = data => Request({
  url: '/api/recode/cat/recodes',
  method: 'GET',
  data,
});

export const product = data => Request({
  url: '/product/filter',
  method: 'GET',
  data,
});
