export function htmlspecialchars(str: string) {
  if (!str) return '';
  if (this.typeOf(str) !== 'string') {
    return str;
  }
  const reg = {
    '"': '&quot;',
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
  };
  for (const k in reg) {
    str = str.replace(new RegExp(k, 'g'), reg[k]);
  }
  return str;
}

export function htmlspecialchars_decode(str: string) {
  const reg = {
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

export function isEmptyObject(obj: Record<string | number, any>) {
  let name;
  for (name in obj) {
    return false;
  }
  return true;
}

export function getTime(fmt: string) {
  fmt = fmt || 'yyyy-MM-dd hh:mm:ss';
  return this.timeFormat(new Date(), fmt);
}

// timeFormat('yyyy-MM-dd hh:mm:ss')
// timeFormat('yyyy-M-d h:m:s')
export function timeFormat(time: Date, fmt: string) {
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
      fmt = fmt.replace(RegExp.$1, RegExp.$1.length === 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length));
    }
  }
  return fmt;
}

export function typeOf(
  o: any
):
  | 'undefined'
  | 'number'
  | 'boolean'
  | 'string'
  | 'function'
  | 'regexp'
  | 'array'
  | 'date'
  | 'error'
  | 'object'
  | 'null' {
  const _toString = Object.prototype.toString;
  const _type = {
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
