import * as msgApi from "./service";
import { ossUrl } from "../../config";

const msg_0 = ossUrl + 'wap/images/msg/msg_0.png';
const msg_1 = ossUrl + 'wap/images/msg/msg_1.png';
const msg_2 = ossUrl + 'wap/images/msg/msg_2.png';

export default {
  namespace: 'message',
  state: {
    data: '',
    list: [
      {
        txt: '我的钱包',
        img: msg_0,
        link: '/pages/platform/balanceDetail/index',
      },
      {
        txt: '我要认证',
        img: msg_1,
        link: '/pages/platform/identifyPage/index',
      },
      {
        txt: '我要考试',
        img: msg_2,
        link: '/pages/platform/examineListPage/index',
      }
    ]
  },
  effects: {
    * get_msg(_, { call, put }) {
      const res = yield call(msgApi.get_msg, {});
      if (res && res.code == '200') {
        yield put({
          type: 'save', payload: {
            data: res.data
          }
        });
        //保存档案列表数据到本地
      }
    },
  },
  reducers: {
    save(state, { payload }) {
      return { ...state, ...payload };
    },
  },

};
