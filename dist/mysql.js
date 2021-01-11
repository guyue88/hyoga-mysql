"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var mysql_1 = require("mysql");
var debug_1 = require("debug");
var utils_1 = require("./utils");
var log = debug_1.default('Hyoga');
/**
 * Mysql数据库实例，封装了常用操作方式
 * @module @hyoga/mysql
 * @author <lq9328@126.com>
 */
var Mysql = /** @class */ (function () {
    /**
     * 创建Mysql实例
     * @param {object} config 数据库连接配置
     */
    function Mysql(config) {
        this.config = __assign({ port: 3306, multipleStatements: true, connectionLimit: 100, host: '', user: '', password: '', database: '' }, config);
        this.sql = '';
        this._resetParams();
    }
    /**
     * 直接执行sql语句
     * @param {string} sql sql语句
     * @return {Promise<any>} sql执行结果
     */
    Mysql.prototype.query = function (sql) {
        return __awaiter(this, void 0, void 0, function () {
            var connection;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this._getConnection()];
                    case 1:
                        connection = _a.sent();
                        this._resetParams();
                        return [2 /*return*/, new Promise(function (resolve, reject) {
                                connection.query(sql, function (err, rows) {
                                    if (err) {
                                        console.error('[@hyoga/mysql] MYSQL_EXECUTED_ERROR', err);
                                        reject(err);
                                    }
                                    else {
                                        log("[@hyoga/mysql] " + _this._sql());
                                        resolve(rows);
                                    }
                                    connection.release();
                                });
                            })];
                }
            });
        });
    };
    /**
     * 设置表名
     * @param {string} tableName 表名
     * @return {Mysql} 实例
     */
    Mysql.prototype.table = function (tableName) {
        if (!tableName) {
            throw new Error('unknown tableName!');
        }
        if (utils_1.typeOf(tableName) !== 'string') {
            console.warn('[@hyoga/mysql] function table params must be type of "string"');
            return this;
        }
        this._tableName = tableName;
        return this;
    };
    /**
     * 设置表的别名
     * @param {string} tableAlias 主表别名
     * @return {Mysql} 实例
     */
    Mysql.prototype.alias = function (tableAlias) {
        if (utils_1.typeOf(tableAlias) !== 'string') {
            console.warn('[@hyoga/mysql] function table params must be type of "string"');
            return this;
        }
        this._tableAlias = tableAlias;
        return this;
    };
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
    Mysql.prototype.field = function (fields) {
        var type = utils_1.typeOf(fields);
        if (type === 'string') {
            fields = fields.split(',');
        }
        else if (type === 'array') {
        }
        else {
            console.warn('[@hyoga/mysql] function field params must be type of "string" or "array"');
            fields = ['*'];
        }
        var res = [];
        fields.forEach(function (item) {
            if (utils_1.typeOf(item) === 'object') {
                res.push(item);
            }
            else if (utils_1.typeOf(item) === 'string') {
                item = item.trim();
                item && res.push(item);
            }
        });
        this._fields = res;
        return this;
    };
    /**
     * group by 操作
     * @param {Array|string} columns 分组列名，可为数组或字符串，字符串以逗号分隔
     * @return {Mysql} 实例
     */
    Mysql.prototype.group = function (columns) {
        var type = utils_1.typeOf(columns);
        if (type !== 'string' && type !== 'array') {
            console.warn('[@hyoga/mysql] function group params must be type of "string" or "array"');
            return this;
        }
        if (type === 'array') {
            columns = columns.join(', ');
        }
        this._group = columns;
        return this;
    };
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
    Mysql.prototype.where = function (where) {
        var type = utils_1.typeOf(where);
        if (type !== 'string' && type !== 'object') {
            console.warn('[@hyoga/mysql] function where params must be type of "object" or "string"');
            return this;
        }
        if (type === 'object') {
            this._where._condition.push(where);
        }
        else {
            this._where._sql.push(where);
        }
        return this;
    };
    /**
     * 设置结果的条数限制
     * @param {number} limit 结果的条数限制
     * @return {Mysql} 实例
     */
    Mysql.prototype.limit = function (limit) {
        var type = utils_1.typeOf(limit);
        if (type !== 'number') {
            console.warn('[@hyoga/mysql] function limit params must be type of "number"');
            limit = parseInt('' + limit);
            if (isNaN(limit)) {
                return this;
            }
        }
        this._limit = limit;
        return this;
    };
    /**
     * 分页操作
     * @param {number} page 当前页数
     * @param {number} pageSize 每页大小
     * @return {Mysql} 实例
     */
    Mysql.prototype.page = function (page, pageSize) {
        if (page === void 0) { page = 1; }
        if (pageSize === void 0) { pageSize = 1; }
        page = parseInt('' + page);
        pageSize = parseInt('' + pageSize);
        page = isNaN(page) ? 1 : page;
        pageSize = isNaN(pageSize) ? 1 : pageSize;
        var offset = (page - 1) * pageSize;
        this._limit = (offset < 0 ? 0 : offset) + ', ' + pageSize;
        return this;
    };
    /**
     * 设置数据
     * @param {object} data 数据
     * @return {Mysql} 实例
     */
    Mysql.prototype.data = function (data) {
        if (utils_1.typeOf(data) !== 'object') {
            console.warn('[@hyoga/mysql] function {data} params must be type of "object"');
            return this;
        }
        this._data = data;
        return this;
    };
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
    Mysql.prototype.order = function (order) {
        var type = utils_1.typeOf(order);
        if (type !== 'array' && type !== 'string') {
            console.warn('[@hyoga/mysql] function {order} params must be type of "array" or "string"');
            return this;
        }
        if (type === 'array') {
            order = order.join(', ');
        }
        this._order = order;
        return this;
    };
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
    Mysql.prototype.join = function (join) {
        var type = utils_1.typeOf(join);
        if (type !== 'object') {
            console.warn('[@hyoga/mysql] function {join} params must be type of "object"');
            return this;
        }
        this._join = __assign(__assign({}, this._join), join);
        return this;
    };
    /**
     * 查找一条数据
     * @param {object|string} where where条件
     * @return {Promise<any>} 查询结果
     */
    Mysql.prototype.find = function (where) {
        return __awaiter(this, void 0, void 0, function () {
            var data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        where && this.where(where);
                        this._limit = 1;
                        return [4 /*yield*/, this.select()];
                    case 1:
                        data = _a.sent();
                        return [2 /*return*/, data && data[0]];
                }
            });
        });
    };
    /**
     * 查找数据
     * @param {object|string} where where条件
     * @return {Promise<any>} 查询结果
     */
    Mysql.prototype.select = function (where) {
        if (!this._tableName) {
            throw new Error('unknown table name!');
        }
        where && this.where(where);
        var sql = 'SELECT';
        sql += this._formatFields();
        sql += ' FROM `' + this._tableName + '`';
        sql += this._tableAlias ? " as " + this._tableAlias : '';
        sql += this._formatJoin();
        sql += this._formatWhere();
        sql += this._group ? ' GROUP BY ' + this._formatFieldsName(this._group) : '';
        sql += this._order ? ' ORDER BY ' + this._order : '';
        // limit，必须在最后面
        sql += this._limit ? ' limit ' + this._limit : '';
        this.sql = sql;
        return this.query(sql);
    };
    /**
     * 更新操作
     * @param {object} column {name: value} 更新的字段与值
     * @param {object|string} where where条件，参见[where]方法
     * @return {Promise<any>} 更新结果
     */
    Mysql.prototype.update = function (column, where) {
        if (!this._tableName) {
            throw new Error('unknown table name!');
        }
        where && this.where(where);
        var sql = 'UPDATE ';
        sql += this._tableName;
        sql += this._tableAlias ? " as " + this._tableAlias + " SET " : ' SET ';
        var tmpArr = [];
        for (var i in column) {
            var tmp = '';
            // 检测数据中是否含有加减号
            var match = (column[i] + '').match(/^(\+|\-)([^+-]+)$/);
            if (match) {
                tmp = this._formatFieldsName(i) + ' = ' + this._formatFieldsName(i) + match[1] + match[2];
            }
            else {
                tmp = this._formatFieldsName(i) + " = '" + column[i] + "'";
            }
            tmpArr.push(tmp);
        }
        sql += tmpArr.join(',');
        sql += this._formatWhere();
        this.sql = sql;
        return this.query(sql);
    };
    /**
     * 一次性更新多条数据
     * @param {object[]} columnList [{id: 1, name: value}] 更新的字段与值，必须包含主键
     * @param {object|string} where where条件，参见[where]方法
     * @return {Promise<any>} 更新结果
     */
    Mysql.prototype.updateMany = function (columnList) {
        if (!columnList || !columnList.length) {
            throw new Error('unknown data list!');
        }
        var duplicate = {};
        for (var key in columnList[0]) {
            duplicate[key] = "VALUES(" + key + ")";
        }
        return this.addMany(columnList, duplicate);
    };
    /**
     * 自增操作
     * @param {string} field 字段名
     * @param {number} step 自增数，默认1
     * @return {Promise<any>} 更新结果
     */
    Mysql.prototype.increase = function (field, step) {
        if (step === void 0) { step = 1; }
        var item = {};
        item[field] = '+' + step;
        return this.update(item);
    };
    /**
     * 自减操作
     * @param {string} field 字段名
     * @param {number} step 自减数，默认1
     * @return {Promise<any>} 更新结果
     */
    Mysql.prototype.decrement = function (field, step) {
        if (step === void 0) { step = 1; }
        var item = {};
        item[field] = '-' + step;
        return this.update(item);
    };
    /**
     * 新增数据
     * @param {object} column 字段键值对
     * @param {object | false} duplicate 出现重复则更新，{id : 100, name : VALUES('test')}，使用时 column 字段需要包含主键，参考sql ON DUPLICATE KEY UPDATE 用法
     * @return {Promise<any>} 操作结果
     */
    Mysql.prototype.add = function (column, duplicate) {
        if (duplicate === void 0) { duplicate = false; }
        if (!this._tableName) {
            throw new Error('unknown table name!');
        }
        var sql = 'INSERT INTO ' + this._tableName;
        var keyArr = [];
        var valueArr = [];
        for (var i in column) {
            keyArr.push('`' + i + '`');
            valueArr.push("'" + column[i] + "'");
        }
        sql += ' (' + keyArr.join(',') + ')';
        sql += ' VALUES (' + valueArr.join(',') + ')';
        if (duplicate) {
            sql += ' ON DUPLICATE KEY UPDATE ';
            // 引用字段
            var tmpArr = [];
            for (var key in duplicate) {
                var value = duplicate[key];
                if (/VALUES\(/gi.test(value)) {
                    tmpArr.push('`' + key + '`=' + value);
                }
                else {
                    tmpArr.push('`' + key + "`='" + value + "'");
                }
            }
            sql += tmpArr.join(',');
        }
        this.sql = sql;
        return this.query(sql);
    };
    /**
     * 批量新增数据
     * @param {Record<string, any>} columnList 字段键值对数组
     * @param {object | false} duplicate 出现重复则更新，{id : 100, name : VALUES('test')}
     * @return {Promise<any>} 操作结果
     */
    Mysql.prototype.addMany = function (columnList, duplicate) {
        if (duplicate === void 0) { duplicate = false; }
        if (!columnList || !columnList.length) {
            throw new Error('unknown data list!');
        }
        if (!this._tableName) {
            throw new Error('unknown table name!');
        }
        var sql = 'INSERT INTO ' + this._tableName;
        var keyArr = [];
        var valueArr = [];
        var keyOk = false;
        columnList.forEach(function (column) {
            var arr = [];
            for (var i in column) {
                !keyOk && keyArr.push('`' + i + '`');
                arr.push("'" + column[i] + "'");
            }
            valueArr.push(arr);
            keyOk = true;
        });
        var values = valueArr.map(function (item) {
            return "(" + item.join(',') + ")";
        });
        sql += " (" + keyArr.join(',') + ")";
        ' (' + keyArr.join(',') + ')';
        sql += " VALUES " + values.join(',');
        if (duplicate) {
            sql += ' ON DUPLICATE KEY UPDATE ';
            // 引用字段
            var tmpArr = [];
            for (var key in duplicate) {
                var value = duplicate[key];
                if (/VALUES\(/gi.test(value)) {
                    tmpArr.push('`' + key + '`=' + value);
                }
                else {
                    tmpArr.push('`' + key + "`='" + value + "'");
                }
            }
            sql += tmpArr.join(',');
        }
        this.sql = sql;
        return this.query(sql);
    };
    /**
     * 删除操作，彻底删除一条数据，一般不建议删除数据，可以通过字段开关控制
     * @param {object|string} where where条件，参见[where]方法
     * @return {Promise<any>} 操作结果
     */
    Mysql.prototype.delete = function (where) {
        if (!this._tableName) {
            throw new Error('unknown table name!');
        }
        where && this.where(where);
        var sql = 'DELETE FROM ' + this._tableName;
        sql += this._formatWhere();
        this.sql = sql;
        return this.query(sql);
    };
    /**
     * 清空数据表
     * @returns {Promise<any>} 执行结果
     */
    Mysql.prototype.truncate = function () {
        if (!this._tableName) {
            throw new Error('unknown tableName!');
        }
        this.sql = "TRUNCATE table " + this._tableName;
        return this.query(this.sql);
    };
    /**
     * 替换数据
     * @param {Record<string, any>} column
     * @returns {Promise<any>} 执行结果
     */
    Mysql.prototype.replace = function (column) {
        if (!this._tableName) {
            throw new Error('unknown table name!');
        }
        var keys = Object.keys(column)
            .map(function (it) { return "`" + it + "`"; })
            .join(',');
        var values = Object.values(column)
            .map(function (it) {
            return "'" + it + "'";
        })
            .join(',');
        this.sql = "REPLACE INTO " + this._tableName + " (" + keys + ") values (" + values + ")";
        return this.query(this.sql);
    };
    /**
     * 关闭数据库连接
     * @return {void}
     */
    Mysql.prototype.close = function () {
        this.pool.end();
    };
    /**
     * 获取数据连接
     * @private
     * @return {PoolConnection} 数据库连接对象
     */
    Mysql.prototype._getConnection = function () {
        var _this = this;
        if (!this.pool) {
            this.pool = mysql_1.createPool(this.config);
        }
        return new Promise(function (resolve, reject) {
            _this.pool.getConnection(function (err, connection) {
                if (err) {
                    console.error('[@hyoga/mysql] MYSQL_CONNECT_ERROR：', err);
                    reject(err);
                }
                else {
                    resolve(connection);
                }
            });
        });
    };
    /**
     * 重置查询条件，每次查询完必须重置
     * @private
     * @return {void}
     */
    Mysql.prototype._resetParams = function () {
        this._tableName = '';
        this._tableAlias = '';
        this._fields = ['*'];
        this._where = { _sql: [], _condition: [] };
        this._limit = '';
        this._order = '';
        this._join = {};
        this._data = {};
        this._group = '';
    };
    /**
     * 需要选择的字段名处理
     * @private
     * @return {string} 需要选择的字段拼接结果
     */
    Mysql.prototype._formatFields = function () {
        var _this = this;
        if (!this._fields.length) {
            return '*';
        }
        var res = ' ';
        this._fields.forEach(function (item, index) {
            res += index > 0 ? ', ' : '';
            if (utils_1.typeOf(item) === 'object') {
                for (var i in item) {
                    res += _this._formatFieldsName(i) + ' as ' + item[i];
                }
            }
            else if (item.includes(' as ')) {
                var tmp = item.split(' as ');
                res += _this._formatFieldsName(tmp[0]) + ' as ' + tmp[1];
            }
            else {
                res += _this._formatFieldsName(item);
            }
        });
        return res;
    };
    /**
     * 字段名处理，添加``，防止报错
     * @private
     * @param {string} field 字段名
     * @return {string} 字段名处理结果
     */
    Mysql.prototype._formatFieldsName = function (field) {
        var table = this._tableAlias || this._tableName;
        var res = '';
        var fieldName = '';
        var tmp = field.split('.');
        if (tmp.length < 2) {
            fieldName = tmp[0];
        }
        else {
            table = tmp[0];
            fieldName = tmp[1];
        }
        var match = /^\s*([a-zA-Z]+)\s*\(\s*([\w]+)\s*\)\s*$/g.exec(fieldName);
        if (match) {
            var funcName = match[1];
            var name_1 = match[2];
            res = funcName + '(`' + table + '`.' + (name_1 === '*' ? name_1 : '`' + name_1 + '`') + ')';
        }
        else {
            res = '`' + table + '`.' + (fieldName === '*' ? fieldName : '`' + fieldName + '`');
        }
        return res;
    };
    /**
     * join操作处理，转变为join语句
     * @private
     * @return {string} join操作的拼接结果
     */
    Mysql.prototype._formatJoin = function () {
        if (!this._join || utils_1.isEmptyObject(this._join)) {
            return '';
        }
        var join = this._join;
        var joinStr = '';
        var mainTable = this._tableAlias || this._tableName;
        for (var i in join) {
            var item = join[i];
            var joinType = item.join ? item.join.toLocaleUpperCase() : 'LEFT';
            joinStr += ' ' + joinType + ' JOIN `' + i + '`';
            joinStr += item.as ? ' AS ' + item.as : '';
            joinStr += ' ON (';
            var tmpArr = [];
            var subTable = item.as ? item.as : i;
            for (var ti in item.on) {
                if (utils_1.typeOf(item.on) === 'string') {
                    tmpArr.push(item.on);
                }
                else {
                    tmpArr.push('`' + mainTable + '`.`' + ti + '`=`' + subTable + '`.`' + item.on[ti] + '`');
                }
            }
            joinStr += tmpArr.join(' AND ') + ')';
        }
        return joinStr;
    };
    /**
     * where条件处理
     * @private
     * @return {string} where条件的拼接结果
     */
    Mysql.prototype._formatWhere = function () {
        var _this = this;
        var sqlStr = this._where._sql.map(function (item) { return "(" + item + ")"; }).join(' AND ');
        var sqlCondition = [];
        this._where._condition.forEach(function (item) {
            var singleWhere = {};
            var multiples2sql = [];
            /* 将多字段名数据单独处理，并将值是字符串的数据转化为数组，便于统一处理 */
            var keys = Object.keys(item);
            keys.forEach(function (key) {
                var val = item[key];
                if (utils_1.typeOf(val) === 'null') {
                    val = ['IS', 'NULL'];
                }
                else if (key.indexOf('_') !== 0 && utils_1.typeOf(val) !== 'array' && utils_1.typeOf(val) !== 'object') {
                    val = ['=', val];
                }
                /* 将多字段名的数据单独处理 {'title|content': ['like', '%javascript%']} */
                var _logic = key.indexOf('|') !== -1 ? 'OR' : key.indexOf('&') !== -1 ? 'AND' : '';
                if (_logic) {
                    var multiple_1 = { _logic: _logic };
                    var multipleKeys = key.split(_logic === 'OR' ? '|' : '&');
                    multipleKeys.forEach(function (m) {
                        multiple_1[m] = val;
                    });
                    var tmp = _this._formatWhereItem(multiple_1);
                    tmp && multiples2sql.push(tmp);
                }
                else {
                    singleWhere[key] = val;
                }
            });
            var single2sql = _this._formatWhereItem(singleWhere);
            var slqList = [];
            single2sql && slqList.push(single2sql);
            var sql = __spreadArrays(slqList, multiples2sql).join(' AND');
            sql && sqlCondition.push(sql);
        });
        var res = [];
        sqlStr && res.push(sqlStr);
        var dist = __spreadArrays(res, sqlCondition).join(' AND ');
        return dist ? " WHERE " + dist : '';
    };
    /**
     * 格式化单个的where条件，每个都是一个完整的对象模式
     * @private
     * @param {Record<string, any>} where
     * @return {string} 处理好的sql
     */
    Mysql.prototype._formatWhereItem = function (where) {
        if (utils_1.isEmptyObject(where))
            return '';
        var res = [];
        var _logic = 'AND';
        if (where._logic) {
            _logic = where._logic;
            delete where._logic;
        }
        for (var fieldName in where) {
            var val = where[fieldName];
            var operate = '';
            fieldName = this._formatFieldsName(fieldName);
            if (utils_1.typeOf(val) === 'array') {
                operate = val[0].trim();
                val = utils_1.typeOf(val[1]) === 'array' ? val[1] : [val[1]];
            }
            res.push(this._formatWhereItemValue(operate, fieldName, val));
        }
        var sql = res.join(" " + _logic + " ");
        return sql ? "(" + sql + ")" : '';
    };
    /**
     * 拼接某个字段的sql语句
     * @private
     * @param {string} operate 操作符 = LIKE 等
     * @param {string} fieldName 字段名
     * @param {array|Record<string, any>} value 字段的值，数组或者对象模式，对象模式下，key是操作符，覆盖 operate 参数
     * @return {string} 拼接好的一个字段值的sql语句
     */
    Mysql.prototype._formatWhereItemValue = function (operate, fieldName, value) {
        var _this = this;
        operate = operate.trim().toLocaleUpperCase();
        var type = utils_1.typeOf(value);
        if (type === 'array') {
            var len = value.length;
            if (len === 1) {
                return this._getOperateResultSql(operate, fieldName, value[0]);
            }
            else if (len > 1 &&
                (operate === 'IN' || operate === 'NOTIN' || operate === 'NOT IN' || operate === 'BETWEEN')) {
                return this._getOperateResultSql(operate, fieldName, value);
            }
            else {
                var res = value.map(function (item) {
                    return _this._getOperateResultSql(operate, fieldName, item);
                });
                return res.join(' OR ');
            }
        }
        else if (type === 'object') {
            var res = [];
            var _logic = 'AND';
            if (value._logic) {
                _logic = value._logic;
                delete value._logic;
            }
            for (var name_2 in value) {
                var tmp = this._getOperateResultSql(name_2, fieldName, value[name_2]);
                tmp && res.push(tmp);
            }
            return res.join(" " + _logic + " ");
        }
        return '';
    };
    /**
     * 主要针对操作符做一些特殊处理，比如IN BETWEEN等
     * @private
     * @param {string} operate 操作符 = LIKE 等
     * @param {string} fieldName 字段名
     * @param {array|string} value 字段的值，数组或者字符串，字符串表示某个值，数组一般表示IN或者BETWEEN的范围
     * @return {string} 拼接好的sql语句
     */
    Mysql.prototype._getOperateResultSql = function (operate, fieldName, value) {
        var valueType = utils_1.typeOf(value);
        if (operate === 'NOTLIKE') {
            operate = 'NOT LIKE';
        }
        /* != null 转为 IS NOT NULL */
        if (operate === '!=' && value === null) {
            return fieldName + " IS NOT NULL";
        }
        if (operate === 'IN' || operate === 'NOTIN' || operate === 'NOT IN') {
            if (operate === 'NOTIN') {
                operate = 'NOT IN';
            }
            if (valueType !== 'array') {
                value = [value];
            }
            return fieldName + " " + operate + " (" + value.join(',') + ")";
        }
        if (operate === 'BETWEEN') {
            if (valueType !== 'array' || value.length < 2)
                return '';
            return fieldName + " " + operate + " " + value[0] + " AND " + value[1];
        }
        value = valueType === 'string' && value !== 'NULL' ? "'" + value + "'" : value;
        return fieldName + " " + operate + " " + value;
    };
    /**
     * 打印生成的sql语句，用于调试
     * @return {string} 生成的sql语句
     */
    Mysql.prototype._sql = function () {
        return this.sql;
    };
    return Mysql;
}());
exports.default = Mysql;
