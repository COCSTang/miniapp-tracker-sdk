var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

import { logInfo } from "../utils/common";
import { getBasicInfo } from "../utils/alipay";
import { MTR } from "./mtr";
import CONFIG from "../config";
import { Hook, TrackerPage, TrackerComponent, TrackerApp } from "./miniapp";

var TrackerClass = function () {
    function TrackerClass(data) {
        _classCallCheck(this, TrackerClass);

        this.data = data;
        this.Mtr = data.Mtr;
        this.App = data.App;
        this.Page = data.Page;
        this.Component = data.Component;
    }

    _createClass(TrackerClass, [{
        key: "log",
        value: function log(seed, p) {
            return this.Mtr.log(seed, p);
        }
    }, {
        key: "err",
        value: function err(r, seed, p) {
            return this.Mtr.err(r, seed, p);
        }
    }, {
        key: "click",
        value: function click(seed, param) {
            return this.Mtr.click(null, seed, param);
        }
    }, {
        key: "calc",
        value: function calc(seed, n, p4) {
            return this.Mtr.calc(null, seed, n, p4);
        }
    }, {
        key: "expo",
        value: function expo(seed, dir, param) {
            return this.Mtr.expo(null, seed, dir, param);
        }
    }, {
        key: "setUserId",
        value: function setUserId(userId) {
            this.Mtr.setUserId(userId);
        }
    }, {
        key: "getUserId",
        value: function getUserId() {
            return this.Mtr.getUserId();
        }
    }, {
        key: "api",
        value: function api(data) {
            return this.Mtr.api(data);
        }
    }]);

    return TrackerClass;
}();

function initMtr() {
    var Mtr = new MTR(CONFIG);
    Mtr.startTime = +Date.now();
    getBasicInfo(function (baseInfo) {
        _extends(Mtr, baseInfo);
        Mtr.baseInfo = baseInfo;
        Mtr.start();
        Mtr.mtrDebug && logInfo("App init start");
    });
    my.canIUse("getRunScene") && my.getRunScene({
        success: function success(res) {
            Mtr.mtrDebug && logInfo("getRunScene", res);
            if (res.envVersion === "release") {
                Mtr.mtrDebug = false;
            } else {
                Mtr.workspaceId = res.envVersion;
            }
        }
    });
    my.canIUse("isCollected") && my.isCollected({
        success: function success(_ref) {
            var isCollected = _ref.isCollected;

            //my.showToast({ content: '查询收藏成功',});
            Mtr.isCollected = isCollected;
            Mtr.mtrDebug && logInfo("isCollected " + isCollected);
        },
        fail: function fail(error) {
            //my.showToast({content: 'fail'+JSON.stringify(error) });
            Mtr.mtrDebug && logInfo("fail" + JSON.stringify(error));
        }
    });
    var tracker = {
        Mtr: Mtr,
        App: new TrackerApp(Mtr),
        Page: new TrackerPage(Mtr),
        Component: new TrackerComponent(Mtr)
    };
    return new TrackerClass(tracker);
}
var Tracker = $global.Tracker || initMtr();
if (!$global.Tracker) {
    var _APP = App,
        _Page = Page,
        _Component = Component;
    //Nn = {};
    App = function App(app) {
        var Mtr = Tracker.Mtr;
        _extends(Mtr, app.mtrConfig || {
            appId: my.canIUse("getAppIdSync") && my.getAppIdSync && my.getAppIdSync().appId,
            server: ["https://webtrack.allcitygo.com:8088/event/upload"],
            appName: "未配置",
            mtrDebug: false
        });
        Hook(app, "onLaunch", Tracker.App.onLaunch());
        Hook(app, "onShow", Tracker.App.onShow());
        Hook(app, "onHide", Tracker.App.onHide());
        Hook(app, "onError", Tracker.App.onError());
        app.Tracker = Tracker;
        return _APP(app);
    };
    Page = function Page(page) {
        var Mtr = Tracker.Mtr;
        if (!('onTap' in page)) {
            page.onTap = function () {};
        }
        if (!('onAppear' in page)) {
            page.onAppear = function () {};
        }
        Hook(page, "onLoad", Tracker.Page.onLoad());
        Hook(page, "onShow", Tracker.Page.onShow());
        Hook(page, "onHide", Tracker.Page.onHide());
        Hook(page, "onUnload", Tracker.Page.onUnload());
        if (Mtr.stat_auto_click) {
            Tracker.Page._hook(page);
        }
        page.$mtr_click = function (seed, param) {
            Mtr.click(page.route, seed, param);
        };
        page.$mtr_expo = function (seed, dir, param) {
            Mtr.expo(page.route, seed, dir, param);
        };
        page.$mtr_calc = function (r, n, p4) {
            Mtr.calc(page.route, r, n, p4);
        };
        return _Page(page);
    };
    Component = function Component(component) {
        Tracker.Component._hook(component);
        return _Component(component);
    };
    $global.Tracker = Tracker;
}
export default Tracker;