'use strict';

module.exports = {
  htmlspecialchars(str) {
    if (!str) return '';
    if (!this.typeOf(str) !== 'string') {
      return str;
    }
    const reg = {
      '"': '&quot;',
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;'
    };
    for (const k in reg) {
      str = str.replace(new RegExp(k, 'g'), reg[k]);
    }
    return str;
  },
  htmlspecialchars_decode(str) {
    const reg = {
      '&quot;': '"',
      '&amp;': '&',
      '&lt;': '<',
      '&gt;': '>',
      '&nbsp;': ' ',
    };
    return str.replace(/&\w+;/g, function(word) {
      return reg[word] || word;
    });
  },
  isEmptyObject(obj) {
    let name;
    for (name in obj) {
      return false;
    }
    return true;
  },
  getTime(fmt) {
    fmt = fmt || 'yyyy-MM-dd hh:mm:ss';
    return this.timeFormat(new Date(), fmt);
  },
  // timeFormat('yyyy-MM-dd hh:mm:ss')
  // timeFormat('yyyy-M-d h:m:s')
  timeFormat(time, fmt) {
    if (!time && this.typeOf(time) !== 'date') return time || null;
    const o = {
      'M+': time.getMonth() + 1, // 月份
      'd+': time.getDate(), // 日
      'h+': time.getHours(), // 小时
      'm+': time.getMinutes(), // 分
      's+': time.getSeconds(), // 秒
    };
    if (/(y+)/.test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (time.getFullYear() + '').substr(4 - RegExp.$1.length));
    }
    for (const k in o) {
      if (new RegExp('(' + k + ')').test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)));
      }
    }
    return fmt;
  },
  typeOf(o) {
    const _toString = Object.prototype.toString;
    const _type = {
      undefined: 'undefined',
      number: 'number',
      boolen: 'boolen',
      string: 'string',
      '[object Function]': 'function',
      '[object RegExp]': 'regexp',
      '[object Array]': 'array',
      '[object Date]': 'date',
      '[object Error]': 'error',
    };
    return _type[typeof o] || _type[_toString.call(o)] || (o ? 'object' : 'null');
  },
};
