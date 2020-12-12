import Request from '../../../utils/request';

export const fortune_day_detail = data => Request({
  url: '/api/fortune',
  method: 'GET',
  data,
});

export const fortune_month_detail = data => Request({
  url: '/api/fortune_month',
  method: 'GET',
  data,
});

export const fortune_year_detail = data => Request({
  url: '/api/fortune_year',
  method: 'GET',
  data,
});

//获取日运日历的时间
export const fortune_day_calendar = data => Request({
  url: '/api/note_time',
  method: 'GET',
  data,
});
