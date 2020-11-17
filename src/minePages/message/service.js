import Request from '../../utils/request';

export const get_msg = (data, loading) => Request({
  url: '/api/user/message_center',
  method: 'GET',
  data,
}, true);

