var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

import { logger, logInfo } from "../utils/common";
import CONFIG from "../config";
import { hookGetLocation, hookRequest } from "../utils/alipay";
var actionEventTypes = ["tap", "longpress", "appear", "submit"];
function actionListener(Mtr, t, e) {
    var mtrDebug = Mtr.mtrDebug;
    mtrDebug && logger("actionListener");
    if (t.trackered) {
        logInfo("actionListener trackered");
        return;
    }
    t.trackered = true;
    var dataset = t.currentTarget.dataset;
    var xpath = (t.id || "") + "#" + e;
    var obj = dataset.obj;
    var name = obj ? obj.seedName || obj.icon_name || obj.text || obj.text_content || obj.mid_text_content || obj.name : undefined;
    var seedName = dataset.seed || dataset.seedName || dataset.title || name || xpath;
    if ("tap" === t.type || "longpress" === t.type || "submit" === t.type) {
        mtrDebug && logInfo("Hook click", seedName);
        //var { url_type, url_path, url_data, url_remark } = obj || {};
        obj = obj || {};
        Mtr.click(this.route, seedName, _extends({ xpath: xpath }, obj, { index: dataset.index || 0, group: dataset.group || "-" }));
    } else if ("appear" === t.type) {
        Mtr.mtrDebug && logInfo("Hook expo", seedName);
        Mtr.expo(this.route, seedName, "-", _extends({ xpath: xpath }, obj, { index: dataset.index || 0, group: dataset.group || "-" }));
    }
    // ("tap" === t.type || "longpress" === t.type) &&  Mtr.click(t, e)
}
export function hookComponent(Mtr, t, e) {
    return function () {
        var i = arguments ? arguments[0] : void 0;
        if (i && i.currentTarget && -1 !== actionEventTypes.indexOf(i.type)) try {
            actionListener.call(this, Mtr, i, t);
        } catch (t) {
            console.error(t);
        }
        return e.apply(this, arguments);
    };
}
export function hookPage(Mtr, t, e) {
    return function () {
        var i = arguments ? arguments[0] : void 0;
        if (i && i.currentTarget && -1 !== actionEventTypes.indexOf(i.type)) try {
            actionListener.call(this, Mtr, i, t);
        } catch (t) {
            console.error(t);
        }
        return e.apply(this, arguments);
    };
}
export function Hook(obj, funName, hook) {
    var fun1 = obj[funName];
    obj[funName] = function (data) {
        hook.call(this, data);
        return fun1 && fun1.call(this, data);
    };
}
export var TrackerApp = function () {
    function TrackerApp(Mtr) {
        _classCallCheck(this, TrackerApp);

        this.Mtr = Mtr;
    }

    _createClass(TrackerApp, [{
        key: "init",
        value: function init(config) {
            config && _extends(this.Mtr, config);
            console.warn("App.init() 已经不再使用,请删除代码,配置信息请放置 App({ mtrConfig:{ ... }})");
        }
    }, {
        key: "onLaunch",
        value: function onLaunch() {
            var Mtr = this.Mtr;
            return function (option) {
                try {
                    if (option) {
                        var query = option.query,
                            scene = option.scene,
                            referrerInfo = option.referrerInfo;

                        Mtr.scene = scene || '';
                        scene && (scene = CONFIG.scene[scene] || scene);
                        var query_bizScenario = query && (query.bizScenario || query.bz);
                        var extraData_bizScenario = referrerInfo && referrerInfo.extraData && referrerInfo.extraData.bizScenario;
                        var referrerInfo_appId = referrerInfo && referrerInfo.appId;
                        if (!Mtr.bizScenario) {
                            Mtr.bizScenario = query_bizScenario || extraData_bizScenario || referrerInfo_appId || scene;
                        }
                        Mtr.referrerAppId = referrerInfo_appId || '';
                    }
                } catch (b) {
                    Mtr.mtrDebug && console.error("Mtr", b);
                }
                Mtr.stat_app_launch && Mtr.appEvent("APP_ON_LAUNCH", {
                    option: JSON.stringify(option),
                    tzone: Mtr.timezoneOffset,
                    referrerAppId: Mtr.referrerAppId,
                    scene: Mtr.scene
                });
                Mtr.stat_location && hookGetLocation(Mtr);
                Mtr.stat_api && hookRequest(Mtr);
                Mtr.mtrDebug && logInfo("App onLaunch");
            };
        }
    }, {
        key: "onHide",
        value: function onHide() {
            var Mtr = this.Mtr;
            return function () {
                Mtr.mtrDebug && logInfo("app onHide");
                Mtr.onAppHide();
            };
        }
    }, {
        key: "onError",
        value: function onError() {
            var Mtr = this.Mtr;
            return function (e) {
                Mtr.mtrDebug && logInfo("app onError");
                Mtr.onAppError(e);
            };
        }
    }, {
        key: "onShow",
        value: function onShow() {
            var Mtr = this.Mtr;
            return function (option) {
                try {
                    if (option) {
                        var query = option.query,
                            scene = option.scene,
                            referrerInfo = option.referrerInfo;

                        Mtr.scene = scene || '';
                        scene && (scene = CONFIG.scene[scene] || scene);
                        var query_bizScenario = query && (query.bizScenario || query.bz);
                        var extraData_bizScenario = referrerInfo && referrerInfo.extraData && referrerInfo.extraData.bizScenario;
                        var referrerInfo_appId = referrerInfo && referrerInfo.appId;
                        if (!Mtr.bizScenario) {
                            Mtr.bizScenario = query_bizScenario || extraData_bizScenario || referrerInfo_appId || scene;
                        }
                        Mtr.referrerAppId = referrerInfo_appId || '';
                    }
                } catch (b) {
                    Mtr.mtrDebug && console.error("Mtr", b);
                }
                Mtr.startTime = +Date.now();
                Mtr.stat_app_show && Mtr.appEvent("APP_ON_SHOW", {
                    option: JSON.stringify(option),
                    referrerAppId: Mtr.referrerAppId,
                    scene: Mtr.scene
                });
                Mtr.mtrDebug && logInfo("app onShow", option);
            };
        }
    }]);

    return TrackerApp;
}();
export var TrackerPage = function () {
    function TrackerPage(Mtr) {
        _classCallCheck(this, TrackerPage);

        this.Mtr = Mtr;
    }

    _createClass(TrackerPage, [{
        key: "init",
        value: function init() {
            console.warn("Page.init() 已经不再使用,请删除代码");
        }
    }, {
        key: "onLoad",
        value: function onLoad() {
            var Mtr = this.Mtr;
            return function (query) {
                Mtr.mtrDebug && logInfo("Page onLoad ", this.route, query);
                if (query && ("bizScenario" in query || "bz" in query)) {
                    var bizScenario = query.bizScenario,
                        bz = query.bz;

                    bizScenario = bizScenario || bz;
                    Mtr.bizScenario = bizScenario;
                }
                this.$mtr_query = query;
            };
        }
    }, {
        key: "onShow",
        value: function onShow() {
            var Mtr = this.Mtr;
            return function () {
                Mtr.mtrDebug && logInfo("onShow", this.route);
                this.$mtr_time_show = +Date.now();
                Mtr.pagePv(this.route, this.$mtr_query);
            };
        }
    }, {
        key: "onPageScroll",
        value: function onPageScroll() {
            var Mtr = this.Mtr;
            return function () {
                Mtr.mtrDebug && logInfo("onPageScroll", this.route);
                Mtr.click(this.route, "PAGE_SCROLL");
            };
        }
    }, {
        key: "onReachBottom",
        value: function onReachBottom() {
            var Mtr = this.Mtr;
            return function () {
                Mtr.mtrDebug && logInfo("onReachBottom", this.route);
                Mtr.click(this.route, "REACH_BOTTOM");
            };
        }
    }, {
        key: "onHide",
        value: function onHide() {
            var Mtr = this.Mtr;
            return function () {
                var now = +Date.now();
                var t0 = now - this.$mtr_time_show;
                Mtr.calc(this.route, "PAGE_STAY", t0, { action: "page_hide" }, true);
                Mtr.mtrDebug && logInfo("onHide", this.route);
                //Mtr.onPageHide(this.route);
            };
        }
    }, {
        key: "onPullDownRefresh",
        value: function onPullDownRefresh() {
            var Mtr = this.Mtr;
            return function () {
                Mtr.mtrDebug && logInfo("onPullDownRefresh ", this.route);
                Mtr.click(this.route, "PULL_DOWN_REFRESH");
            };
        }
    }, {
        key: "onUnload",
        value: function onUnload() {
            var Mtr = this.Mtr;
            return function () {
                Mtr.mtrDebug && logInfo("onUnload", this.route);
                //Mtr.onPageUnload(this.route);
            };
        }
    }, {
        key: "_hook",
        value: function _hook(page) {
            var lifeFunction = ["onShow", "onPageScroll", "onLoad", "onReachBottom", "onHide", "onPullDownRefresh", "onUnload", "setData", "dispatch", "register", "subscribeAction", "subscribe", "watch", "when", "getInstance"];
            if (this.Mtr.stat_auto_click) {
                for (var e in page) {
                    "function" === typeof page[e] && lifeFunction.indexOf(e) === -1 && e.indexOf("$") === -1 && (page[e] = hookPage(this.Mtr, e, page[e]));
                }
            }
            return page;
        }
    }]);

    return TrackerPage;
}();
export var TrackerComponent = function () {
    function TrackerComponent(Mtr) {
        _classCallCheck(this, TrackerComponent);

        this.Mtr = Mtr;
    }

    _createClass(TrackerComponent, [{
        key: "init",
        value: function init() {
            console.warn("Component.init() 已经不再使用,请删除代码");
        }
    }, {
        key: "_hook",
        value: function _hook(c) {
            if (this.Mtr.stat_auto_click) {
                var a = c.methods;
                for (var e in a) {
                    "function" === typeof a[e] && e.indexOf("$") === -1 && (a[e] = hookComponent(this.Mtr, e, a[e]));
                }
            }
            return c;
        }
    }]);

    return TrackerComponent;
}();