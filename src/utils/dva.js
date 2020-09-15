import Taro from '@tarojs/taro';
import { create } from 'dva-core';
import { createLogger } from 'redux-logger';
import createLoading from 'dva-loading';

let app, store, dispatch, registered;

function createApp(options) {
    // redux日志
    // opt.onAction = [createLogger()];

    app = create(options);

    app.use(createLoading({}));

    // if (!global.registered) options.models.forEach(model => app.model(model));

    registered = true;

    app.start();

    store = app._store;

    app.getStore = () => store;

    dispatch = store.dispatch;

    app.dispatch = dispatch;

    return app;
}

export default {
    createApp,
    getDispatch() {
        return app.dispatch;
    }
}
