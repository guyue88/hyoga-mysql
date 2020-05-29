export interface Config {
  host: string;
  port?: number;
  user: string;
  password: string;
  database: string;
}

/**
 * Mysql数据库实例，封装了常用操作方式
 * @module @hyoga/mysql
 * @author <lq9328@126.com>
 */
declare class Mysql {
  /**
   * 创建Mysql实例
   * @param {Config} config 数据库连接配置
   */
  constructor(config: Config);

  /**
   * 直接执行sql语句
   * @param {string} sql sql语句
   * @return {Promise<any>} sql执行结果
   */
  query(sql: string): Promise<any>;

  /**
   * 设置表名
   * @param {string} tableName 表名
   * @return {Mysql} 实例
   */
  table(tableName: string): Mysql;

  /**
   * 设置表的别名
   * @param {string} tableAlias 主表别名
   * @return {Mysql} 实例
   */
  alias(tableAlias: string): Mysql;

  /**
   * 设置需要选取的字段，字符串或数组格式
   * @param {string|Array} fields 需要选取的字段
   * @example 
   * // SELECT `admins`.`id`, `admins`.`name` FROM `admins` limit 1
   * mysql.table('admins').field('id, name').find();
   * // SELECT `admins`.`id`, `admins`.`name` as a, `admins`.`status` as b FROM `admins` limit 1
   * mysql.table('admins').field(['id', 'name as a', { status: 'b' }]).find();
   * @return {Mysql} 实例
   */
  field(fields: string | string[]): Mysql;

  /**
   * group by 操作
   * @param {Array|string} columns 分组列名，可为数组或字符串，字符串以逗号分隔
   * @return {Mysql} 实例
   */
  group(columns: string | string[]): Mysql;

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
   * @return {Mysql} 实例
   */
  where(where: string | {[index: string]: any}): Mysql;

  /**
   * 设置结果的条数限制
   * @param {number} limit 结果的条数限制
   * @return {Mysql} 实例
   */
  limit(limit: number): Mysql;

  /**
   * 分页操作
   * @param {number} page 当前页数
   * @param {number} pageSize 每页大小
   * @return {Mysql} 实例
   */
  page(page: number, pageSize: number): Mysql;

  /**
   * 设置数据
   * @param {object} data 数据
   * @return {Mysql} 实例
   */
  data(data: any): Mysql;

  /**
   * 排序
   * @param {array|string} order 排序
   * @example
   * // SELECT `article_categorys`.`*` FROM `article_categorys` ORDER BY id desc
   * mysql.table('article_categorys').order('id desc').select();
   * 
   * //SELECT `article_categorys`.`*` FROM `article_categorys` ORDER BY id desc, name asc
   * mysql.table('article_categorys').order([ 'id desc', 'name asc' ]).select();
   * 
   * @return {Mysql} 实例
   */
  order(order: string | string[]): Mysql;

  /**
   * 设置join条件，可以多次join
   * @param {object} join join条件
   * @example
   * // SELECT `a`.`*`, `b`.`*` FROM `article_posts` as a LEFT JOIN `article_categorys` AS b ON (a.`category_id`=b.`id`) limit 1
   * mysql.table('article_posts').alias('a').field([ 'a.*', 'b.*' ]).join({
   *  article_categorys: {
   *    as: 'b',
   *    on: { category_id: 'id' }
   *  }
   * }).find();
   *
   * // SELECT `a`.`*`, `article_categorys`.`*` FROM `article_posts` as a LEFT JOIN `article_categorys` ON (a.`category_id`=article_categorys.`id`) limit 1
   * mysql.table('article_posts').alias('a').field([ 'a.*', 'article_categorys.*' ]).join({
   *  article_categorys: {
   *    // as: 'b',
   *    on: { category_id: 'id' }
   *  }
   * }).find();
   * 
   * @return {Mysql} 实例
   */
  join(join: object): Mysql;

  /**
   * 查找一条数据
   * @param {object|string} where where条件，直接的sql语句或者k-v条件
   * @return {Promise<any>} 查询结果
   */
  find(where?: string | {[index: string]: any}):Promise<any>;

  /**
   * 查找数据
   * @param {object|string} where where条件
   * @return {Promise<any>} 查询结果
   */
  select(where?: string | {[index: string]: any}):Promise<any>;

  /**
   * 更新操作
   * @param {object} column {name: value} 更新的字段与值
   * @param {object|string} where where条件，参见[where]方法
   * @return {Promise<any>} 更新结果
   */
  update(column: {[index: string]: any}, where?: string | {[index: string]: any}): Promise<any>;

  /**
   * 一次性更新多条数据
   * @param {object[]} columnList [{id: 1, name: value}] 更新的字段与值，必须包含主键
   * @param {object|string} where where条件，参见[where]方法
   * @return {Promise<any>} 更新结果
   */
  updateMany(columnList: {[index: string]: any}[]): Promise<any>;

  /**
   * 自增操作
   * @param {string} field 字段名
   * @param {number} step 自增数，默认1
   * @return {Promise<any>} 更新结果
   */
  increase(field: string, step: number): Promise<any>;

  /**
   * 自减操作
   * @param {string} field 字段名
   * @param {number} step 自减数，默认1
   * @return {Promise<any>} 更新结果
   */
  decrement(field: string, step: number): Promise<any>;

  /**
   * 新增数据
   * @param {object} column 字段键值对
   * @param {object} duplicate 出现重复则更新，{id : 100, name : VALUES('test')}
   * @return {Promise<any>} 操作结果
   */
  add(column: {[index: string]: any}, duplicate?: boolean | {[index: string]: any}): Promise<any>;

  /**
   * 批量新增数据
   * @param {object} columnList 字段键值对数组
   * @param {object} duplicate 出现重复则更新，{id : 100, name : VALUES('test')}
   * @return {Promise<any>} 操作结果
   */
  addMany(columnList: {[index: string]: any}[], duplicate?: boolean | {[index: string]: any}): Promise<any>;

  /**
   * 删除操作，彻底删除一条数据，一般不建议删除数据，可以通过字段开关控制
   * @param {object|string} where where条件，参见[where]方法
   * @return {Promise<any>} 操作结果
   */
  delete(where?: {[index: string]: any}): Promise<any>;
}

export default Mysql;