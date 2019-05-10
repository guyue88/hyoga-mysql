'use strict';

const { createConnection } = require('mysql');
const { typeOf, isEmptyObject } = require('../utils/util');

/**
 * Mysql数据库实例，封装了常用操作方式
 */
class Mysql {
  /**
   * 创建Mysql实例
   * @param {object} config 数据库连接配置
   */
  constructor(config) {
    this.config = {
      host: '',
      port: 3306,
      user: '',
      password: '',
      database: '',
      ...config,
    };
    this.sql = '';
    this.conn = undefined;
    this._resetParams();
  }

  /**
   * 直接执行sql语句
   * @param {string} sql sql语句
   * @return {Promise<any>} sql执行结果
   */
  query(sql) {
    this._resetParams();
    this._connect();
    return new Promise((resolve, reject) => {
      this.conn.query(sql, (err, rows) => {
        this._close();
        if (err) {
          console.error('[bsmysql] MYSQL_EXECUTED_ERROR', err);
          reject(err);
        } else {
          // console.log(`[bsmysql] ${this._sql()}`);
          resolve(rows);
        }
      });
    });
  }

  /**
   * 设置表名
   * @param {string} tableName 表名
   * @return {Mysql} 实例
   */
  table(tableName) {
    if (!tableName) {
      throw new Error('unknow tableName!');
    }
    if (typeOf(tableName) !== 'string') {
      console.warn('[bsmysql] function table params must be type of "string"');
      return this;
    }
    this._tableName = tableName;
    return this;
  }

  /**
   * 设置表的别名
   * @param {string} tableAlias 主表别名
   * @return {Mysql} 实例
   */
  alias(tableAlias) {
    if (typeOf(tableAlias) !== 'string') {
      console.warn('[bsmysql] function table params must be type of "string"');
      return this;
    }
    this._tableAlias = tableAlias;
    return this;
  }

  /**
   * 设置需要选取的字段，字符串或数组格式
   * @param {string|Array} fields 需要选取的字段
   * 		1、'a, b, c'
   * 		2、['a', 'b', {'c': 'd'}]
   * @return {Mysql} 实例
   */
  field(fields) {
    const type = typeOf(fields);
    if (type === 'string') {
      this._fields = [ fields ];
    } else if (type === 'array') {
      this._fields = fields;
    } else {
      console.warn('[bsmysql] function field params must be type of "string" or "array"');
      this._fields = [ '*' ];
    }
    return this;
  }

  /**
   * group by 操作
   * @param {Array|string} collums 分组列名，可为数组或字符串，字符串以逗号分隔
   * @return {Mysql} 实例
   */
  group(collums) {
    const type = typeOf(collums);
    if (type !== 'string' && type !== 'array') {
      console.warn('[bsmysql] function group params must be type of "string" or "array"');
      return this;
    }
    if (type === 'array') {
      collums = collums.join(', ');
    }
    this._group = collums;
    return this;
  }

  /**
   * where条件设置
   * @param {object|string} where where条件
   *  'field = 10'
   *  {'field': 10}
   *	{'field': {">":10}},{'field': {"like":10}}
   *	{'field': {">":10,'_logic':'or'}}
   *	{'field': {"=": 'select id from a where name="zhangsan"','_isSql':true}}
   * @return {Mysql} 实例
   */
  where(where) {
    const type = typeOf(where);
    if (type !== 'string' && type !== 'object') {
      console.warn('[bsmysql] function where params must be type of "object" or "string"');
      return this;
    }
    if (type === 'object') {
      let length = 0;
      // eslint-disable-next-line no-unused-vars
      for (const i in where) {
        length++;
      }
      where.length = length;
    }
    this._where = { ...this._where, ...where };
    return this;
  }

  /**
   * 设置结果的条数限制
   * @param {number} limit 结果的条数限制
   * @return {Mysql} 实例
   */
  limit(limit) {
    const type = typeOf(limit);
    if (type !== 'number') {
      console.warn('[bsmysql] function limit params must be type of "number"');
      limit = parseInt(limit);
      if (isNaN(limit)) {
        return this;
      }
    }
    this._limit = limit;
    return this;
  }

  /**
   * 分页操作
   * @param {number} page 当前页数
   * @param {number} pageSize 每页大小
   * @return {Mysql} 实例
   */
  page(page = 1, pageSize = 1) {
    page = parseInt(page);
    pageSize = parseInt(pageSize);
    page = isNaN(page) ? 1 : page;
    pageSize = isNaN(pageSize) ? 1 : pageSize;
    const offset = (page - 1) * pageSize;
    this._limit = (offset < 0 ? 0 : offset) + ', ' + pageSize;
    return this;
  }

  /**
   * 设置数据
   * @param {object} data 数据
   * @return {Mysql} 实例
   */
  data(data) {
    if (typeOf(data) !== 'object') {
      console.warn('[bsmysql] function {data} params must be type of "object"');
      return this;
    }
    this._data = data;
    return this;
  }

  /**
   * 排序
   * @param {array|string} order 排序
   * @return {Mysql} 实例
   */
  order(order) {
    const type = typeOf(order);
    if (type !== 'array' && type !== 'string') {
      console.warn('[bsmysql] function {order} params must be type of "array" or "string"');
      return this;
    }
    if (type === 'array') {
      order = order.join(', ');
    }
    this._order = order;
    return this;
  }

  /**
   * 设置join条件，可以多次join
   * @param {object} join join条件
   * {
   *   cate: {
   *   	 join: "left", // 有 left、right和inner 3 个值，默认left
   *     as: "c",
   *     on: { id: "id", uid: "uid" }
   *   }
   * }
   * @return {Mysql} 实例
   */
  join(join) {
    const type = typeOf(join);
    if (type !== 'object') {
      console.warn('[bsmysql] function {join} params must be type of "object"');
      return this;
    }
    this._join = { ...this._join, ...join };
    return this;
  }

  /**
   * 查找一条数据
   * @param {object|string} where where条件
   * @return {Promise<any>} 查询结果
   */
  async find(where = null) {
    where && this.where(where);
    this._limit = 1;
    const data = await this.select();
    return data && data[0];
  }

  /**
   * 查找数据
   * @param {object|string} where where条件
   * @return {Promise<any>} 查询结果
   */
  select(where = null) {
    if (!this._tableName) {
      throw new Error('unknow table name!');
    }

    where && this.where(where);

    let sql = 'SELECT';

    sql += this._formatFields();
    sql += ' FROM `' + this._tableName + '`';
    sql += this._tableAlias ? ` as ${this._tableAlias}` : '';

    sql += this._formatJoin();
    sql += this._formatWhere();

    sql += this._group ? ' GROUP BY ' + this._formatFieldsName(this._group) : '';
    sql += this._order ? ' ORDER BY ' + this._order : '';
    // limit，必须在最后面
    sql += this._limit ? ' limit ' + this._limit : '';

    this.sql = sql;
    return this.query(sql);
  }

  /**
   * 更新操作
   * @param {object} collum {name: value} 更新的字段与值
   * @return {Promise<any>} 更新结果
   */
  update(collum) {
    if (!this._tableName) {
      throw new Error('unknow table name!');
    }
    let sql = 'UPDATE ';
    sql += this._tableName;
    sql += this._tableAlias ? ` as ${this._tableAlias} SET ` : ' SET ';

    const tmpArr = [];
    for (const i in collum) {
      let tmp = '';
      const match = collum[i].match(/^(\+|\-)([^+-]+)$/);
      if (match) {
        tmp = this._formatFieldsName(i) + ' = ' + this._formatFieldsName(i) + match[1] + match[2];
      } else {
        tmp = this._formatFieldsName(i) + ' = \'' + collum[i] + '\'';
      }
      tmpArr.push(tmp);
    }
    sql += tmpArr.join(',');
    sql += this._formatWhere();
    this.sql = sql;
    return this.query(sql);
  }

  /**
   * 自增操作
   * @param {string} field 字段名
   * @param {number} step 自增数，默认1
   * @return {Promise<any>} 更新结果
   */
  increase(field, step = 1) {
    const item = {};
    item[field] = '+' + step;
    return this.update(item);
  }

  /**
   * 自减操作
   * @param {string} field 字段名
   * @param {number} step 自减数，默认1
   * @return {Promise<any>} 更新结果
   */
  decrement(field, step = 1) {
    const item = {};
    item[field] = '-' + step;
    return this.update(item);
  }

  /**
   * 新增数据
   * @param {object} collum 列字段
   * @param {object} duplicate 出现重复则更新，{key : 'c', value : VALUES('123')}
   * @return {Promise<any>} 操作结果
   */
  add(collum, duplicate = false) {
    if (!this._tableName) {
      throw new Error('unknow table name!');
    }
    let sql = 'INSERT INTO ' + this._tableName;
    const keyArr = [];
    const valueArr = [];
    for (const i in collum) {
      keyArr.push('`' + i + '`');
      valueArr.push('\'' + collum[i] + '\'');
    }
    sql += ' (' + keyArr.join(',') + ')';
    sql += ' VALUES (' + valueArr.join(',') + ')';

    if (duplicate) {
      sql += ' ON DUPLICATE KEY UPDATE ';
      // 引用字段
      if (/VALUES\(/ig.test(duplicate.value)) {
        sql += '`' + duplicate.key + '`=' + duplicate.value;
      } else {
        sql += '`' + duplicate.key + '`=\'' + duplicate.value + '\'';
      }
    }
    this.sql = sql;
    return this.query(sql);
  }

  /**
   * 删除操作，彻底删除一条数据，一般不建议删除数据，可以通过字段开关控制
   * @return {Promise<any>} 操作结果
   */
  delete() {
    if (!this._tableName) {
      throw new Error('unknow table name!');
    }
    let sql = 'DELETE FROM ' + this._tableName;
    sql += this._formatWhere();
    this.sql = sql;
    return this.query(sql);
  }

  /**
   * 获取数据连接
   * @return {Mysql.connection} 数据库连接对象
   */
  _getConnection() {
    const connection = createConnection(this.config);

    connection.connect(err => {
      if (err) {
        console.error('[bsmysql] MYSQL_CONNECT_ERROR：', err);
      }
    });
    connection.on('error', err => {
      console.error('[bsmysql] MYSQL_RUNTIME_ERROR：', err);
      if (err.code === 'PROTOCOL_CONNECTION_LOST') {
        this._connect();
        console.info('[bsmysql] MYSQL_RECONNECTING...');
      } else {
        throw err;
      }
    });
    return connection;
  }

  /**
   * 获取数据库连接对象
   * @return {void}
   */
  _connect() {
    this.conn = this._getConnection();
  }

  /**
   * 关闭数据库连接
   * @return {void}
   */
  _close() {
    this.conn.end();
    this.conn = undefined;
  }

  /**
   * 重置查询条件，每次查询完必须重置
   * @return {void}
   */
  _resetParams() {
    this._tableName = '';
    this._tableAlias = '';
    this._fields = [ '*' ];
    this._where = {};
    this._limit = '';
    this._order = '';
    this._join = {};
    this._data = {};
    this._group = '';
  }

  /**
   * 需要选择的字段名处理
   * @return {string} 需要选择的字段拼接结果
   */
  _formatFields() {
    if (!this._fields.length) {
      return '*';
    }

    let res = ' ';

    this._fields.forEach((item, index) => {
      res += index > 0 ? ', ' : '';
      if (typeOf(item) === 'object') {
        for (const i in item) {
          res += this._formatFieldsName(i) + ' as ' + item[i];
        }
      } else if (item.includes(' as ')) {
        const tmp = item.split(' as ');
        res += this._formatFieldsName(tmp[0]) + ' as ' + tmp[1];
      } else {
        res += this._formatFieldsName(item);
      }
    });
    return res;
  }

  /**
   * 字段名处理，添加``，防止报错
   * @param {string} field 字段名
   * @return {string} 字段名处理结果
   */
  _formatFieldsName(field) {
    let table = this._tableAlias || this._tableName;
    let res = '';
    let fieldName = '';

    const tmp = field.split('.');
    if (tmp.length < 2) {
      fieldName = tmp[0];
    } else {
      table = tmp[0];
      fieldName = tmp[1];
    }

    const match = /^\s*([a-zA-Z]+)\s*\(\s*([\w]+)\s*\)\s*$/g.exec(fieldName);
    if (match) {
      const funcName = match[1];
      const name = match[2];
      res = funcName + '(`' + table + '`.`' + name + '`)';
    } else {
      res = '`' + table + '`.`' + fieldName + '`';
    }
    return res;
  }

  /**
   * join操作处理，转变为join语句
   * @return {string} join操作的拼接结果
   */
  _formatJoin() {
    if (!this._join || isEmptyObject(this._join)) {
      return '';
    }

    const join = this._join;
    let joinStr = '';
    const mainTable = this._tableAlias || this._tableName;

    for (const i in join) {
      const item = join[i];
      const joinType = item.join ? item.join.toLocaleUpperCase() : 'LEFT';
      joinStr += ' ' + joinType + ' JOIN `' + i + '`';
      joinStr += item.as ? ' AS ' + item.as : '';
      joinStr += ' ON (';

      const tmpArr = [];
      const subTable = item.as ? item.as : i;
      for (const ti in item.on) {
        if (typeOf(item.on) === 'string') {
          tmpArr.push(item.on);
        } else {
          tmpArr.push(mainTable + '.`' + ti + '`=' + subTable + '.`' + item.on[ti] + '`');
        }
      }
      joinStr += tmpArr.join(' AND ') + ')';
    }
    return joinStr;
  }

  /**
   * where条件处理
   * @return {string} where条件的拼接结果
   */
  _formatWhere() {
    let sql = ' ';

    if (typeOf(this._where) === 'string') {
      sql += 'where ' + this._where;
    } else if (!isEmptyObject(this._where)) {

      sql += 'where ';
      const length = this._where.length || 1;
      let index = 1;
      delete this._where.length;

      for (let i in this._where) {
        const item = this._where[i];
        let _logic = 'AND';

        i = this._formatFieldsName(i);

        if (typeOf(item) !== 'object') {
          sql += i + ' = \'' + item + '\'';
        } else if (typeOf(item) === 'object') {
          if (item._logic) {
            _logic = item._logic;
            delete item._logic;
          }

          let separatorL = '\'',
            separatorR = '\'';
          if (item._isSql) {
            separatorL = '(';
            separatorR = ')';
            delete item._isSql;
          }
          for (const ti in item) {
            sql += i + ' ' + ti + ' ' + separatorL + item[ti] + separatorR;
            break;
          }

        }
        sql += index !== length ? ' ' + _logic + ' ' : '';
        index++;
      }
    }
    return sql;
  }

  /**
   * 打印生成的sql语句，用于调试
   * @return {string} 生成的sql语句
   */
  _sql() {
    return this.sql;
  }
}

module.exports = Mysql;
