import { PoolConfig, createPool, PoolConnection, Pool } from 'mysql';
import debug from 'debug';
import { typeOf, isEmptyObject } from './utils';

const log = debug('hyoga-mysql');

export type Config = PoolConfig & {
  prefix?: string;
};

class MysqlPool {
  private pool?: Pool;
  private config: Config;

  /**
   * 创建Mysql实例
   * @param {object} config 数据库连接配置
   */
  constructor(config: Config) {
    this.config = config;
  }

  /**
   * 关闭数据库连接
   * @return {void}
   */
  public close(): void {
    this.pool && this.pool.end();
    this.pool = undefined;
  }

  /**
   * 获取数据连接
   * @private
   * @return {PoolConnection} 数据库连接对象
   */
  public getConnection(): Promise<PoolConnection> {
    if (!this.pool) {
      this.pool = createPool(this.config);
    }

    return new Promise((resolve, reject) => {
      this.pool?.getConnection((err, connection) => {
        if (err) {
          console.error('[@hyoga/mysql] MYSQL_CONNECT_ERROR：', err);
          reject(err);
        } else {
          resolve(connection);
        }
      });
    });
  }
}

type Condition =
  | string
  | number
  | null
  | [string, string | number | null]
  | [string, (string | number | null)[]]
  | Record<string, string | number>;

export class Builder {
  private query: (sql: string) => Promise<any>;

  private _tableName: string;
  private _tableAlias: string;
  private _fields: (string | Record<string, any>)[];
  private _group: string;
  private _where: { _condition: Record<string, Condition>[]; _sql: string[] };
  private _limit: number | string;
  private _data: Record<string, any>;
  private _order: string;
  private _join: Record<string, any>;

  constructor(tableName: string, query: (sql: string) => Promise<any>) {
    this._resetParams();
    this._tableName = tableName;
    this.query = query;
  }

  /**
   * 设置表的别名
   * @param {string} tableAlias 主表别名
   * @return {Builder} 实例
   */
  alias(tableAlias: string): Builder {
    if (typeOf(tableAlias) !== 'string') {
      console.warn('[@hyoga/mysql] function table params must be type of "string"');
      return this;
    }
    this._tableAlias = tableAlias;
    return this;
  }

  /**
   * 设置需要选取的字段，字符串或数组格式
   * @param {string|Array} fields 需要选取的字段
   * @example
   * // SELECT `admins`.`id`, `admins`.`name` FROM `admins` limit 1
   * mysql.table('admins').field('id, name').find();
   * // SELECT `admins`.`id`, `admins`.`name` as a, `admins`.`status` as b FROM `admins` limit 1
   * mysql.table('admins').field(['id', 'name as a', { status: 'b' }]).find();
   * @return {Builder} 实例
   */
  field(fields: string | Array<string | Record<string, string>>): Builder {
    const type = typeOf(fields);
    if (type === 'string') {
      fields = (fields as string).split(',');
    } else if (type !== 'array') {
      console.warn('[@hyoga/mysql] function field params must be type of "string" or "array"');
      fields = ['*'];
    }
    const res: (string | Record<string, string>)[] = [];
    (fields as Array<string | Record<string, string>>).forEach(item => {
      if (typeOf(item) === 'object') {
        res.push(item);
      } else if (typeOf(item) === 'string') {
        item = (item as string).trim();
        item && res.push(item);
      }
    });
    this._fields = res;
    return this;
  }

  /**
   * group by 操作
   * @param {Array|string} columns 分组列名，可为数组或字符串，字符串以逗号分隔
   * @return {Builder} 实例
   */
  group(columns: Array<any> | string): Builder {
    const type = typeOf(columns);
    if (type !== 'string' && type !== 'array') {
      console.warn('[@hyoga/mysql] function group params must be type of "string" or "array"');
      return this;
    }
    if (type === 'array') {
      columns = (columns as Array<any>).join(', ');
    }
    this._group = columns as string;
    return this;
  }

  /**
   * where条件设置，接受字符串或者对象形式，可以多次调用，每次调用都作为一个整体，多次调用使用 AND 连接
   * @param {object|string} where where条件
   * @example
   * // SELECT `admins`.`*` FROM `admins` WHERE (`admins`.`status` = 'on') limit 1
   * mysql.table('admins').where({ status: 'on' }).find();
   *
   * // SELECT `admins`.`*` FROM `admins` WHERE (id = 10 OR id < 2) limit 1
   * mysql.table('admins').where('id = 10 OR id < 2').find();
   *
   * // SELECT `admins`.`*` FROM `admins` WHERE (`admins`.`id` != 1) limit 1
   * mysql.table('admins').where({id: ['!=', 1]}).find();
   *
   * // NULL操作
   *
   * SELECT `admins`.`*` FROM `admins` WHERE (`admins`.`id` IS NULL) limit 1
   * mysql.table('admins').where({id: null}).find();
   *
   * // SELECT `admins`.`*` FROM `admins` WHERE (`admins`.`id` IS NOT NULL) limit 1
   * mysql.table('admins').where({id: [ '!=', null ]}).find();
   *
   * // LIKE 操作
   *
   * // SELECT `admins`.`*` FROM `admins` WHERE (`admins`.`name` LIKE '%admin%') limit 1
   * mysql.table('admins').where({name: [ 'like', '%admin%' ]}).find();
   *
   * // SELECT `admins`.`*` FROM `admins` WHERE (`admins`.`name` NOT LIKE '%admin%') limit 1
   * mysql.table('admins').where({name: [ 'notlike', '%admin%' ]}).find();
   *
   * // SELECT `admins`.`*` FROM `admins` WHERE (`admins`.`name` LIKE '%admin%' OR `admins`.`email` LIKE '%admin%') limit 1
   * mysql.table('admins').where({'name|email': [ 'like', '%admin%' ]}).find();
   *
   * // SELECT `admins`.`*` FROM `admins` WHERE (`admins`.`name` LIKE '%admin%' AND `admins`.`email` LIKE '%admin%') limit 1
   * mysql.table('admins').where({'name&email': [ 'like', '%admin%' ]}).find();
   *
   * // 一对多操作
   * // SELECT `admins`.`*` FROM `admins` WHERE (`admins`.`name` = 'admin' OR `admins`.`name` = 'editor') limit 1
   * mysql.table('admins').where({name: [ '=', [ 'admin', 'editor' ] ]}).find();
   *
   * // IN 操作
   * // SELECT `admins`.`*` FROM `admins` WHERE (`admins`.`id` IN (5,10)) limit 1
   * mysql.table('admins').where({'id': [ 'in', [5, 10] ]}).find();
   *
   * // SELECT `admins`.`*` FROM `admins` WHERE (`admins`.`id` IN (5, 10)) limit 1
   * mysql.table('admins').where({'id': [ 'in', '5, 10' ]}).find();
   *
   * // SELECT `admins`.`*` FROM `admins` WHERE (`admins`.`id` NOT IN (5,10)) limit 1
   * mysql.table('admins').where({'id': [ 'notin', [5, 10] ]}).find();
   *
   * // BETWEEN 操作
   * // SELECT `admins`.`*` FROM `admins` WHERE (`admins`.`id` BETWEEN 5 AND 10) limit 1
   * mysql.table('admins').where({'id': [ 'between', [5, 10] ]}).find();
   *
   * // SELECT `admins`.`*` FROM `admins` WHERE (`admins`.`id` BETWEEN 5 AND 10 AND `admins`.`name` = 'admin') limit 1
   * mysql.table('admins').where({'id': [ 'between', [5, 10] ], 'name': 'admin'}).find();
   *
   * // SELECT `admins`.`*` FROM `admins` WHERE (`admins`.`id` BETWEEN 5 AND 10 OR `admins`.`name` = 'admin') limit 1
   * mysql.table('admins').where({'id': [ 'between', [5, 10] ], 'name': 'admin', '_logic': 'OR'}).find();
   *
   * // 多字段操作
   * // SELECT `admins`.`*` FROM `admins` WHERE (`admins`.`status` = 'on') AND (`admins`.`id` >= 1 AND `admins`.`id` <= 10) limit 1
   * mysql.table('admins').where({'status': 'on'}).where({'id': {'>=': 1, '<=': 10}}).find();
   *
   * // SELECT `admins`.`*` FROM `admins` WHERE (`admins`.`status` = 'on') AND (`admins`.`id` >= 1 OR `admins`.`id` <= 10) limit 1
   * mysql.table('admins').where({'status': 'on'}).where({'id': {'>=': 1, '<=': 10, '_logic': 'OR'}}).find();
   *
   * @return {Builder} 实例
   */
  where(where: Record<string, any> | string): Builder {
    const type = typeOf(where);
    if (type !== 'string' && type !== 'object') {
      console.warn('[@hyoga/mysql] function where params must be type of "object" or "string"');
      return this;
    }
    if (type === 'object') {
      this._where._condition.push(where as Record<string, any>);
    } else {
      this._where._sql.push(where as string);
    }
    return this;
  }

  /**
   * 设置结果的条数限制
   * @param {number} limit 结果的条数限制
   * @return {Builder} 实例
   */
  limit(limit: number): Builder {
    const type = typeOf(limit);
    if (type !== 'number') {
      console.warn('[@hyoga/mysql] function limit params must be type of "number"');
      limit = parseInt('' + limit);
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
   * @return {Builder} 实例
   */
  page(page = 1, pageSize = 1): Builder {
    page = parseInt('' + page);
    pageSize = parseInt('' + pageSize);
    page = isNaN(page) ? 1 : page;
    pageSize = isNaN(pageSize) ? 1 : pageSize;
    const offset = (page - 1) * pageSize;
    this._limit = (offset < 0 ? 0 : offset) + ', ' + pageSize;
    return this;
  }

  /**
   * 设置数据
   * @param {object} data 数据
   * @return {Builder} 实例
   */
  data(data: Record<string, any>): Builder {
    if (typeOf(data) !== 'object') {
      console.warn('[@hyoga/mysql] function {data} params must be type of "object"');
      return this;
    }
    this._data = data;
    return this;
  }

  /**
   * 排序
   * @param {array|string} order 排序
   * @example
   * // SELECT `article_categories`.`*` FROM `article_categories` ORDER BY id desc
   * mysql.table('article_categories').order('id desc').select();
   *
   * //SELECT `article_categories`.`*` FROM `article_categories` ORDER BY id desc, name asc
   * mysql.table('article_categories').order([ 'id desc', 'name asc' ]).select();
   *
   * @return {Builder} 实例
   */
  order(order: Array<string> | string): Builder {
    const type = typeOf(order);
    if (type !== 'array' && type !== 'string') {
      console.warn('[@hyoga/mysql] function {order} params must be type of "array" or "string"');
      return this;
    }
    if (type === 'array') {
      order = (order as Array<string>).join(', ');
    }
    this._order = order as string;
    return this;
  }

  /**
   * 设置join条件，可以多次join
   * @param {object} join join条件
   * @example
   * // SELECT `a`.`*`, `b`.`*` FROM `article_posts` as a LEFT JOIN `article_categories` AS b ON (a.`category_id`=b.`id`) limit 1
   * mysql.table('article_posts').alias('a').field([ 'a.*', 'b.*' ]).join({
   *  article_categories: {
   *    as: 'b',
   *    on: { category_id: 'id' }
   *  }
   * }).find();
   *
   * // SELECT `a`.`*`, `article_categories`.`*` FROM `article_posts` as a LEFT JOIN `article_categories` ON (a.`category_id`=article_categories.`id`) limit 1
   * mysql.table('article_posts').alias('a').field([ 'a.*', 'article_categories.*' ]).join({
   *  article_categories: {
   *    // as: 'b',
   *    on: { category_id: 'id' }
   *  }
   * }).find();
   *
   * @return {Builder} 实例
   */
  join(join: Record<string, any>): Builder {
    const type = typeOf(join);
    if (type !== 'object') {
      console.warn('[@hyoga/mysql] function {join} params must be type of "object"');
      return this;
    }
    this._join = { ...this._join, ...join };
    return this;
  }

  /**
   * 查找一条数据
   * @return {Promise<any>} 查询结果
   */
  async find(): Promise<any> {
    this._limit = 1;
    const data = await this.select();
    return data && data[0];
  }

  /**
   * 查找数据
   * @return {Promise<any>} 查询结果
   */
  select(): Promise<any> {
    if (!this._tableName) {
      throw new Error('unknown table name!');
    }

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

    return this.query(sql);
  }

  /**
   * 更新操作
   * @param {object} column {name: value} 更新的字段与值
   * @param {object|string} where where条件，参见[where]方法
   * @return {Promise<any>} 更新结果
   */
  update(column: Record<string, any>, where?: Record<string, any> | string): Promise<any> {
    if (!this._tableName) {
      throw new Error('unknown table name!');
    }
    where && this.where(where);
    let sql = 'UPDATE ';
    sql += this._tableName;
    sql += this._tableAlias ? ` as ${this._tableAlias} SET ` : ' SET ';

    const tmpArr: string[] = [];
    for (const i in column) {
      let tmp = '';
      // 检测数据中是否含有加减号
      const match = (column[i] + '').match(/^(\+|-)([^+-]+)$/);
      if (match) {
        tmp = this._formatFieldsName(i) + ' = ' + this._formatFieldsName(i) + match[1] + match[2];
      } else {
        // eslint-disable-next-line quotes
        tmp = this._formatFieldsName(i) + " = '" + column[i] + "'";
      }
      tmpArr.push(tmp);
    }
    sql += tmpArr.join(',');
    sql += this._formatWhere();

    return this.query(sql);
  }

  /**
   * 一次性更新多条数据
   * @param {object[]} columnList [{id: 1, name: value}] 更新的字段与值，必须包含主键
   * @param {object|string} where where条件，参见[where]方法
   * @return {Promise<any>} 更新结果
   */
  updateMany(columnList: Record<string, any>[]): Promise<any> {
    if (!columnList || !columnList.length) {
      throw new Error('unknown data list!');
    }
    const duplicate = {};
    for (const key in columnList[0]) {
      duplicate[key] = `VALUES(${key})`;
    }
    return this.addMany(columnList, duplicate);
  }

  /**
   * 自增操作
   * @param {string} field 字段名
   * @param {number} step 自增数，默认1
   * @return {Promise<any>} 更新结果
   */
  increase(field: string, step = 1): Promise<any> {
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
  decrement(field: string, step = 1): Promise<any> {
    const item = {};
    item[field] = '-' + step;
    return this.update(item);
  }

  /**
   * 新增数据
   * @param {object} column 字段键值对
   * @param {object | false} duplicate 出现重复则更新，{id : 100, name : VALUES('test')}，使用时 column 字段需要包含主键，参考sql ON DUPLICATE KEY UPDATE 用法
   * @return {Promise<any>} 操作结果
   */
  add(column: Record<string, any>, duplicate: Record<string, any> | false = false): Promise<any> {
    if (!this._tableName) {
      throw new Error('unknown table name!');
    }
    let sql = 'INSERT INTO ' + this._tableName;
    const keyArr: string[] = [];
    const valueArr: string[] = [];
    for (const i in column) {
      keyArr.push('`' + i + '`');
      // eslint-disable-next-line quotes
      valueArr.push("'" + column[i] + "'");
    }
    sql += ' (' + keyArr.join(',') + ')';
    sql += ' VALUES (' + valueArr.join(',') + ')';

    if (duplicate) {
      sql += ' ON DUPLICATE KEY UPDATE ';
      // 引用字段
      const tmpArr: string[] = [];
      for (const key in duplicate) {
        const value = duplicate[key];
        if (/VALUES\(/gi.test(value)) {
          tmpArr.push('`' + key + '`=' + value);
        } else {
          // eslint-disable-next-line quotes
          tmpArr.push('`' + key + "`='" + value + "'");
        }
      }
      sql += tmpArr.join(',');
    }

    return this.query(sql);
  }

  /**
   * 批量新增数据
   * @param {Record<string, any>} columnList 字段键值对数组
   * @param {object | false} duplicate 出现重复则更新，{id : 100, name : VALUES('test')}
   * @return {Promise<any>} 操作结果
   */
  addMany(columnList: Record<string, any>[], duplicate: Record<string, any> | false = false): Promise<any> {
    if (!columnList || !columnList.length) {
      throw new Error('unknown data list!');
    }
    if (!this._tableName) {
      throw new Error('unknown table name!');
    }
    let sql = 'INSERT INTO ' + this._tableName;
    const keyArr: string[] = [];
    const valueArr: string[][] = [];
    let keyOk = false;
    columnList.forEach(column => {
      const arr: string[] = [];
      for (const i in column) {
        !keyOk && keyArr.push('`' + i + '`');
        arr.push(`'${column[i]}'`);
      }
      valueArr.push(arr);
      keyOk = true;
    });
    const values = valueArr.map(item => {
      return `(${item.join(',')})`;
    });

    sql += ` (${keyArr.join(',')})`;
    ' (' + keyArr.join(',') + ')';
    sql += ` VALUES ${values.join(',')}`;

    if (duplicate) {
      sql += ' ON DUPLICATE KEY UPDATE ';
      // 引用字段
      const tmpArr: string[] = [];
      for (const key in duplicate) {
        const value = duplicate[key];
        if (/VALUES\(/gi.test(value)) {
          tmpArr.push('`' + key + '`=' + value);
        } else {
          // eslint-disable-next-line quotes
          tmpArr.push('`' + key + "`='" + value + "'");
        }
      }
      sql += tmpArr.join(',');
    }

    return this.query(sql);
  }

  /**
   * 删除操作，彻底删除一条数据，一般不建议删除数据，可以通过字段开关控制
   * @param {object|string} where where条件，参见[where]方法
   * @return {Promise<any>} 操作结果
   */
  delete(where: Record<string, any> | string): Promise<any> {
    if (!this._tableName) {
      throw new Error('unknown table name!');
    }
    where && this.where(where);
    let sql = 'DELETE FROM ' + this._tableName;
    sql += this._formatWhere();

    return this.query(sql);
  }

  /**
   * 清空数据表
   * @returns {Promise<any>} 执行结果
   */
  truncate(): Promise<any> {
    if (!this._tableName) {
      throw new Error('unknown tableName!');
    }
    const sql = `TRUNCATE table ${this._tableName}`;
    return this.query(sql);
  }

  /**
   * 替换数据
   * @param {Record<string, any>} column
   * @returns {Promise<any>} 执行结果
   */
  replace(column: Record<string, any>): Promise<any> {
    if (!this._tableName) {
      throw new Error('unknown table name!');
    }
    const keys = Object.keys(column)
      .map(it => `\`${it}\``)
      .join(',');
    const values = Object.values(column)
      .map(it => {
        return `'${it}'`;
      })
      .join(',');

    const sql = `REPLACE INTO ${this._tableName} (${keys}) values (${values})`;
    return this.query(sql);
  }

  /**
   * 重置查询条件，每次查询完必须重置
   * @private
   * @return {void}
   */
  private _resetParams(): void {
    this._tableName = '';
    this._tableAlias = '';
    this._fields = ['*'];
    this._where = { _sql: [], _condition: [] };
    this._limit = '';
    this._order = '';
    this._join = {};
    this._data = {};
    this._group = '';
  }

  /**
   * 需要选择的字段名处理
   * @private
   * @return {string} 需要选择的字段拼接结果
   */
  private _formatFields(): string {
    if (!this._fields.length) {
      return '*';
    }

    let res = ' ';

    this._fields.forEach((item, index) => {
      res += index > 0 ? ', ' : '';
      if (typeOf(item) === 'object') {
        for (const i in item as Record<string, any>) {
          res += this._formatFieldsName(i) + ' as ' + item[i];
        }
      } else if (item.includes(' as ')) {
        const tmp = item.split(' as ');
        res += this._formatFieldsName(tmp[0]) + ' as ' + tmp[1];
      } else {
        res += this._formatFieldsName(item as string);
      }
    });
    return res;
  }

  /**
   * 字段名处理，添加``，防止报错
   * @private
   * @param {string} field 字段名
   * @return {string} 字段名处理结果
   */
  private _formatFieldsName(field: string): string {
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
      res = funcName + '(`' + table + '`.' + (name === '*' ? name : '`' + name + '`') + ')';
    } else {
      res = '`' + table + '`.' + (fieldName === '*' ? fieldName : '`' + fieldName + '`');
    }
    return res;
  }

  /**
   * join操作处理，转变为join语句
   * @private
   * @return {string} join操作的拼接结果
   */
  private _formatJoin(): string {
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

      const tmpArr: string[] = [];
      const subTable = item.as ? item.as : i;
      for (const ti in item.on) {
        if (typeOf(item.on) === 'string') {
          tmpArr.push(item.on);
        } else {
          tmpArr.push('`' + mainTable + '`.`' + ti + '`=`' + subTable + '`.`' + item.on[ti] + '`');
        }
      }
      joinStr += tmpArr.join(' AND ') + ')';
    }
    return joinStr;
  }

  /**
   * where条件处理
   * @private
   * @return {string} where条件的拼接结果
   */
  private _formatWhere(): string {
    const sqlStr = this._where._sql.map(item => `(${item})`).join(' AND ');
    const sqlCondition: string[] = [];
    this._where._condition.forEach(item => {
      const singleWhere = {};
      const multiples2sql: string[] = [];

      /* 将多字段名数据单独处理，并将值是字符串的数据转化为数组，便于统一处理 */
      const keys = Object.keys(item);
      keys.forEach(key => {
        let val = item[key];
        if (typeOf(val) === 'null') {
          val = ['IS', 'NULL'];
        } else if (key.indexOf('_') !== 0 && typeOf(val) !== 'array' && typeOf(val) !== 'object') {
          val = ['=', val as any];
        }
        /* 将多字段名的数据单独处理 {'title|content': ['like', '%javascript%']} */
        const _logic = key.indexOf('|') !== -1 ? 'OR' : key.indexOf('&') !== -1 ? 'AND' : '';
        if (_logic) {
          const multiple = { _logic };
          const multipleKeys = key.split(/[|&]/);
          multipleKeys.forEach(m => {
            multiple[m] = val;
          });
          const tmp = this._formatWhereItem(multiple);
          tmp && multiples2sql.push(tmp);
        } else {
          singleWhere[key] = val;
        }
      });
      const single2sql = this._formatWhereItem(singleWhere);
      const slqList: string[] = [];
      single2sql && slqList.push(single2sql);
      const sql = [...slqList, ...multiples2sql].join(' AND');
      sql && sqlCondition.push(sql);
    });
    const res: string[] = [];
    sqlStr && res.push(sqlStr);
    const dist = [...res, ...sqlCondition].join(' AND ');
    return dist ? ` WHERE ${dist}` : '';
  }

  /**
   * 格式化单个的where条件，每个都是一个完整的对象模式
   * @private
   * @param {Record<string, any>} where
   * @return {string} 处理好的sql
   */
  private _formatWhereItem(where: Record<string, any>): string {
    if (isEmptyObject(where)) return '';
    const res: string[] = [];
    let _logic = 'AND';
    if (where._logic) {
      _logic = where._logic;
      delete where._logic;
    }
    for (let fieldName in where) {
      let val = where[fieldName];
      let operate = '';
      fieldName = this._formatFieldsName(fieldName);
      if (typeOf(val) === 'array') {
        operate = val[0].trim();
        val = typeOf(val[1]) === 'array' ? val[1] : [val[1]];
      }
      res.push(this._formatWhereItemValue(operate, fieldName, val));
    }
    const sql = res.join(` ${_logic} `);
    return sql ? `(${sql})` : '';
  }

  /**
   * 拼接某个字段的sql语句
   * @private
   * @param {string} operate 操作符 = LIKE 等
   * @param {string} fieldName 字段名
   * @param {array|Record<string, any>} value 字段的值，数组或者对象模式，对象模式下，key是操作符，覆盖 operate 参数
   * @return {string} 拼接好的一个字段值的sql语句
   */
  private _formatWhereItemValue(operate: string, fieldName: string, value: Array<any> | Record<string, any>): string {
    operate = operate.trim().toLocaleUpperCase();
    const type = typeOf(value);
    if (type === 'array') {
      const len = value.length;
      if (len === 1) {
        return this._getOperateResultSql(operate, fieldName, value[0]);
      } else if (
        len > 1 &&
        (operate === 'IN' || operate === 'NOTIN' || operate === 'NOT IN' || operate === 'BETWEEN')
      ) {
        return this._getOperateResultSql(operate, fieldName, value as Array<any>);
      } else {
        const res: string[] = value.map(item => {
          return this._getOperateResultSql(operate, fieldName, item);
        });
        return res.join(' OR ');
      }
    } else if (type === 'object') {
      const res: string[] = [];
      let _logic = 'AND';
      if ((value as Record<string, any>)._logic) {
        _logic = (value as Record<string, any>)._logic;
        delete (value as Record<string, any>)._logic;
      }
      for (const name in value) {
        const tmp = this._getOperateResultSql(name, fieldName, value[name]);
        tmp && res.push(tmp);
      }
      return res.join(` ${_logic} `);
    }
    return '';
  }

  /**
   * 主要针对操作符做一些特殊处理，比如IN BETWEEN等
   * @private
   * @param {string} operate 操作符 = LIKE 等
   * @param {string} fieldName 字段名
   * @param {array|string} value 字段的值，数组或者字符串，字符串表示某个值，数组一般表示IN或者BETWEEN的范围
   * @return {string} 拼接好的sql语句
   */
  private _getOperateResultSql(operate: string, fieldName: string, value: Array<any> | string): string {
    const valueType = typeOf(value);
    if (operate === 'NOTLIKE') {
      operate = 'NOT LIKE';
    }
    /* != null 转为 IS NOT NULL */
    if (operate === '!=' && value === null) {
      return `${fieldName} IS NOT NULL`;
    }
    if (operate === 'IN' || operate === 'NOTIN' || operate === 'NOT IN') {
      if (operate === 'NOTIN') {
        operate = 'NOT IN';
      }
      if (valueType !== 'array') {
        value = [value];
      }
      return `${fieldName} ${operate} (${(value as any[]).join(',')})`;
    }
    if (operate === 'BETWEEN') {
      if (valueType !== 'array' || value.length < 2) return '';
      return `${fieldName} ${operate} ${value[0]} AND ${value[1]}`;
    }
    value = valueType === 'string' && value !== 'NULL' ? `'${value}'` : value;
    return `${fieldName} ${operate} ${value}`;
  }
}

/**
 * Mysql数据库实例，封装了常用操作方式
 * @module @hyoga/mysql
 * @author <lq9328@126.com>
 */
export default class Mysql {
  private config: Config;
  private mysqlPool: MysqlPool;
  private sql = '';

  /**
   * 创建Mysql实例
   * @param {object} config 数据库连接配置
   */
  constructor(config: Config) {
    this.config = {
      port: 3306,
      multipleStatements: true,
      connectionLimit: 100,
      host: '',
      user: '',
      password: '',
      database: '',
      prefix: '',
      ...config,
    };
    this.mysqlPool = new MysqlPool(this.config);
  }

  /**
   * 直接执行sql语句
   * @param {string} sql sql语句
   * @return {Promise<any>} sql执行结果
   */
  async query(sql: string): Promise<any> {
    this.sql = sql;
    const connection = await this.mysqlPool.getConnection();
    return new Promise((resolve, reject) => {
      connection.query(sql, (err, rows) => {
        if (err) {
          console.error('[@hyoga/mysql] MYSQL_EXECUTED_ERROR', err);
          reject(err);
        } else {
          log(`[@hyoga/mysql] ${sql}`);
          resolve(rows);
        }
        connection.release();
      });
    });
  }

  /**
   * 设置表名
   * @param {string} tableName 表名
   * @return {Builder} 实例
   */
  table(tableName: string): Builder {
    if (!tableName) {
      throw new Error('unknown tableName!');
    }
    if (typeOf(tableName) !== 'string') {
      console.warn('[@hyoga/mysql] function table params must be type of "string"');
      return new Builder(tableName, this.query);
    }
    const finalTableName = `${this.config.prefix}${tableName}`;
    return new Builder(finalTableName, this.query.bind(this));
  }

  /**
   * 关闭数据库连接
   * @return {void}
   */
  close(): void {
    this.mysqlPool.close();
  }

  /**
   * 打印生成的sql语句，用于调试
   * @return {string} 生成的sql语句
   */
  _sql(): string {
    return this.sql;
  }
}
