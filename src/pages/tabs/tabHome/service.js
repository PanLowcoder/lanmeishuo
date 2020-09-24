import Request from '../../../utils/request';

export const homepage = data => Request({
  url: '/api/index',
  method: 'GET',
  data,
});
