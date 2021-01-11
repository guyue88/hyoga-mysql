"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.typeOf = exports.timeFormat = exports.getTime = exports.isEmptyObject = exports.htmlspecialchars_decode = exports.htmlspecialchars = void 0;
function htmlspecialchars(str) {
    if (!str)
        return '';
    if (this.typeOf(str) !== 'string') {
        return str;
    }
    var reg = {
        '"': '&quot;',
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
    };
    for (var k in reg) {
        str = str.replace(new RegExp(k, 'g'), reg[k]);
    }
    return str;
}
exports.htmlspecialchars = htmlspecialchars;
function htmlspecialchars_decode(str) {
    var reg = {
        '&quot;': '"',
        '&amp;': '&',
        '&lt;': '<',
        '&gt;': '>',
        '&nbsp;': ' ',
    };
    return str.replace(/&\w+;/g, function (word) {
        return reg[word] || word;
    });
}
exports.htmlspecialchars_decode = htmlspecialchars_decode;
function isEmptyObject(obj) {
    var name;
    for (name in obj) {
        return false;
    }
    return true;
}
exports.isEmptyObject = isEmptyObject;
function getTime(fmt) {
    fmt = fmt || 'yyyy-MM-dd hh:mm:ss';
    return this.timeFormat(new Date(), fmt);
}
exports.getTime = getTime;
// timeFormat('yyyy-MM-dd hh:mm:ss')
// timeFormat('yyyy-M-d h:m:s')
function timeFormat(time, fmt) {
    if (!time && this.typeOf(time) !== 'date')
        return time || null;
    var o = {
        'M+': time.getMonth() + 1,
        'd+': time.getDate(),
        'h+': time.getHours(),
        'm+': time.getMinutes(),
        's+': time.getSeconds(),
    };
    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (time.getFullYear() + '').substr(4 - RegExp.$1.length));
    }
    for (var k in o) {
        if (new RegExp('(' + k + ')').test(fmt)) {
            fmt = fmt.replace(RegExp.$1, RegExp.$1.length === 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length));
        }
    }
    return fmt;
}
exports.timeFormat = timeFormat;
function typeOf(o) {
    var _toString = Object.prototype.toString;
    var _type = {
        undefined: 'undefined',
        number: 'number',
        boolean: 'boolean',
        string: 'string',
        '[object Function]': 'function',
        '[object RegExp]': 'regexp',
        '[object Array]': 'array',
        '[object Date]': 'date',
        '[object Error]': 'error',
    };
    return _type[typeof o] || _type[_toString.call(o)] || (o ? 'object' : 'null');
}
exports.typeOf = typeOf;
