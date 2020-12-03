import common from './common';
import login from '../pages/login/model';

import tabHome from '../pages/tabs/tabHome/model';
import tabArticle from '../pages/tabs/tabArticle/model';
import tabRecord from '../pages/tabs/tabRecord/model';
import tabUser from '../pages/tabs/tabUser/model';
import message from '../minePages/message/model';

import astro from '../pages/astro/model';

import articleDetail from '../pages/articleDetail/model';
import likeOrCollect from '../minePages/likeOrCollect/model';
//档案-新增档案、新增档案袋、获取微信档案列表
import record from '../pages/record/model';

import synastryDetail from '../pages/synastry/synastryDetail/model';



export default [
    common,
    login,
    tabHome,
    tabArticle,
    tabRecord,
    tabUser,

    message,
    articleDetail,
    likeOrCollect,
    record,
    astro,

    synastryDetail
]