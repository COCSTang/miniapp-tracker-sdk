var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

import "../global";
export function getPagePath() {
    try {
        // var a = getCurrentPages()
        var a = getCurrentPages()[getCurrentPages().length - 1];
        return a.route;
    } catch (c) {
        console.warn('Tracker get current page path error:' + c);
    }
}
export function getMainInfo() {
    var a = { url: getPagePath() };
    //console.log(a)
    return a;
}
export function dateFormat(t) {
    var format = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'yyyy-MM-dd hh:mm:ss.S';

    var fmt = format; //|| 'yyyy-MM-dd hh:mm:ss.S'
    if ((typeof t === 'undefined' ? 'undefined' : _typeof(t)) !== 'object') {
        t = new Date(t);
    }
    var o = {
        'M+': t.getMonth() + 1,
        'd+': t.getDate(),
        'h+': t.getHours(),
        'm+': t.getMinutes(),
        's+': t.getSeconds(),
        'q+': Math.floor((t.getMonth() + 3) / 3),
        S: t.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (t.getFullYear() + '').substr(4 - RegExp.$1.length));
    for (var k in o) {
        if (new RegExp('(' + k + ')').test(fmt)) fmt = fmt.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length));
    }return fmt;
}
export function dealExtra(param) {
    if (!param) return {};
    var prefix = "mtr-";
    var out = {};
    for (var n in param) {
        if (param[n] != undefined) {
            var a = 0 === n.indexOf(prefix) ? n : prefix + n;
            out[a] = param[n];
        }
    }return out;
}
export function extend(e, t) {
    for (var r in t) {
        void 0 !== t[r] && (e[r] = t[r]);
    }return e;
}
export function _encodeStr(e) {
    return 'string' == typeof e ? e.replace(/=|,|\^|\$\$/g, function (e) {
        switch (e) {
            case ',':
                return '%2C';
            case '^':
                return '%5E';
            case '$$':
                return '%24%24';
            case '=':
                return '%3D';
            default:
                return ' ';
        }
    }) : e;
}
export function _formatExinfoParam(e) {
    var t = [];
    for (var r in e) {
        if (e.hasOwnProperty(r)) {
            var msg = "" + e[r];
            if ('[object Object]' === msg) {
                msg = JSON.stringify(e[r]);
                if (msg.length >= 1024) {
                    msg = msg.substring(0, 1024);
                }
            }
            t.push(r + '=' + _encodeStr(msg));
        }
    }
    return t.join('^');
}
var TAG = 'Tracker';
export function logger(tag) {
    var _console;

    for (var _len = arguments.length, payload = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        payload[_key - 1] = arguments[_key];
    }

    (_console = console).debug.apply(_console, ['%c [' + TAG + ']' + tag, 'color: #649191; font-weight: bold'].concat(payload));
}
export function logInfo(tag) {
    var _console2;

    for (var _len2 = arguments.length, payload = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
        payload[_key2 - 1] = arguments[_key2];
    }

    (_console2 = console).log.apply(_console2, ['%c [' + TAG + ']' + tag, 'color: #b10ff7; font-weight: bold'].concat(payload));
}
//事件英文名称，可由小写字母、下划线、数字组成，并以小写字母开头，（长度为32个字符以内），不能重复，保存后不可修改
export function formatSeed(seed) {
    var msg = "" + seed;
    if (msg === '[object Object]') {
        msg = _formatExinfoParam(seed); //encodeURIComponent(JSON.stringify(seed))
    }
    msg = encodeURIComponent(msg);
    if (msg.indexOf('%') > -1) {
        var reg = new RegExp('%', 'g');
        msg = msg.replace(reg, "");
    }
    if (msg.length >= 32) {
        msg = msg.substring(0, 32);
    }
    return msg.toLowerCase();
}