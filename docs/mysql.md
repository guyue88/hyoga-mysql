<a name="module_@hyoga/mysql"></a>

## @hyoga/mysql
Mysql数据库实例，封装了常用操作方式

**Author**: <lq9328@126.com>  

* [@hyoga/mysql](#module_@hyoga/mysql)
    * [~Mysql](#module_@hyoga/mysql..Mysql)
        * [new Mysql(config)](#new_module_@hyoga/mysql..Mysql_new)
        * [.query(sql)](#module_@hyoga/mysql..Mysql+query) ⇒ <code>Promise.&lt;any&gt;</code>
        * [.table(tableName)](#module_@hyoga/mysql..Mysql+table) ⇒ <code>Mysql</code>
        * [.alias(tableAlias)](#module_@hyoga/mysql..Mysql+alias) ⇒ <code>Mysql</code>
        * [.field(fields)](#module_@hyoga/mysql..Mysql+field) ⇒ <code>Mysql</code>
        * [.group(columns)](#module_@hyoga/mysql..Mysql+group) ⇒ <code>Mysql</code>
        * [.where(where)](#module_@hyoga/mysql..Mysql+where) ⇒ <code>Mysql</code>
        * [.limit(limit)](#module_@hyoga/mysql..Mysql+limit) ⇒ <code>Mysql</code>
        * [.page(page, pageSize)](#module_@hyoga/mysql..Mysql+page) ⇒ <code>Mysql</code>
        * [.data(data)](#module_@hyoga/mysql..Mysql+data) ⇒ <code>Mysql</code>
        * [.order(order)](#module_@hyoga/mysql..Mysql+order) ⇒ <code>Mysql</code>
        * [.join(join)](#module_@hyoga/mysql..Mysql+join) ⇒ <code>Mysql</code>
        * [.find(where)](#module_@hyoga/mysql..Mysql+find) ⇒ <code>Promise.&lt;any&gt;</code>
        * [.select(where)](#module_@hyoga/mysql..Mysql+select) ⇒ <code>Promise.&lt;any&gt;</code>
        * [.update(column, where)](#module_@hyoga/mysql..Mysql+update) ⇒ <code>Promise.&lt;any&gt;</code>
        * [.updateMany(columnList, where)](#module_@hyoga/mysql..Mysql+updateMany) ⇒ <code>Promise.&lt;any&gt;</code>
        * [.increase(field, step)](#module_@hyoga/mysql..Mysql+increase) ⇒ <code>Promise.&lt;any&gt;</code>
        * [.decrement(field, step)](#module_@hyoga/mysql..Mysql+decrement) ⇒ <code>Promise.&lt;any&gt;</code>
        * [.add(column, duplicate)](#module_@hyoga/mysql..Mysql+add) ⇒ <code>Promise.&lt;any&gt;</code>
        * [.addMany(columnList, duplicate)](#module_@hyoga/mysql..Mysql+addMany) ⇒ <code>Promise.&lt;any&gt;</code>
        * [.delete(where)](#module_@hyoga/mysql..Mysql+delete) ⇒ <code>Promise.&lt;any&gt;</code>
        * [._sql()](#module_@hyoga/mysql..Mysql+_sql) ⇒ <code>string</code>

<a name="module_@hyoga/mysql..Mysql"></a>

### @hyoga/mysql~Mysql
**Kind**: inner class of [<code>@hyoga/mysql</code>](#module_@hyoga/mysql)  

* [~Mysql](#module_@hyoga/mysql..Mysql)
    * [new Mysql(config)](#new_module_@hyoga/mysql..Mysql_new)
    * [.query(sql)](#module_@hyoga/mysql..Mysql+query) ⇒ <code>Promise.&lt;any&gt;</code>
    * [.table(tableName)](#module_@hyoga/mysql..Mysql+table) ⇒ <code>Mysql</code>
    * [.alias(tableAlias)](#module_@hyoga/mysql..Mysql+alias) ⇒ <code>Mysql</code>
    * [.field(fields)](#module_@hyoga/mysql..Mysql+field) ⇒ <code>Mysql</code>
    * [.group(columns)](#module_@hyoga/mysql..Mysql+group) ⇒ <code>Mysql</code>
    * [.where(where)](#module_@hyoga/mysql..Mysql+where) ⇒ <code>Mysql</code>
    * [.limit(limit)](#module_@hyoga/mysql..Mysql+limit) ⇒ <code>Mysql</code>
    * [.page(page, pageSize)](#module_@hyoga/mysql..Mysql+page) ⇒ <code>Mysql</code>
    * [.data(data)](#module_@hyoga/mysql..Mysql+data) ⇒ <code>Mysql</code>
    * [.order(order)](#module_@hyoga/mysql..Mysql+order) ⇒ <code>Mysql</code>
    * [.join(join)](#module_@hyoga/mysql..Mysql+join) ⇒ <code>Mysql</code>
    * [.find(where)](#module_@hyoga/mysql..Mysql+find) ⇒ <code>Promise.&lt;any&gt;</code>
    * [.select(where)](#module_@hyoga/mysql..Mysql+select) ⇒ <code>Promise.&lt;any&gt;</code>
    * [.update(column, where)](#module_@hyoga/mysql..Mysql+update) ⇒ <code>Promise.&lt;any&gt;</code>
    * [.updateMany(columnList, where)](#module_@hyoga/mysql..Mysql+updateMany) ⇒ <code>Promise.&lt;any&gt;</code>
    * [.increase(field, step)](#module_@hyoga/mysql..Mysql+increase) ⇒ <code>Promise.&lt;any&gt;</code>
    * [.decrement(field, step)](#module_@hyoga/mysql..Mysql+decrement) ⇒ <code>Promise.&lt;any&gt;</code>
    * [.add(column, duplicate)](#module_@hyoga/mysql..Mysql+add) ⇒ <code>Promise.&lt;any&gt;</code>
    * [.addMany(columnList, duplicate)](#module_@hyoga/mysql..Mysql+addMany) ⇒ <code>Promise.&lt;any&gt;</code>
    * [.delete(where)](#module_@hyoga/mysql..Mysql+delete) ⇒ <code>Promise.&lt;any&gt;</code>
    * [._sql()](#module_@hyoga/mysql..Mysql+_sql) ⇒ <code>string</code>

<a name="new_module_@hyoga/mysql..Mysql_new"></a>

#### new Mysql(config)
创建Mysql实例


| Param | Type | Description |
| --- | --- | --- |
| config | <code>object</code> | 数据库连接配置 |

<a name="module_@hyoga/mysql..Mysql+query"></a>

#### mysql.query(sql) ⇒ <code>Promise.&lt;any&gt;</code>
直接执行sql语句

**Kind**: instance method of [<code>Mysql</code>](#module_@hyoga/mysql..Mysql)  
**Returns**: <code>Promise.&lt;any&gt;</code> - sql执行结果  

| Param | Type | Description |
| --- | --- | --- |
| sql | <code>string</code> | sql语句 |

<a name="module_@hyoga/mysql..Mysql+table"></a>

#### mysql.table(tableName) ⇒ <code>Mysql</code>
设置表名

**Kind**: instance method of [<code>Mysql</code>](#module_@hyoga/mysql..Mysql)  
**Returns**: <code>Mysql</code> - 实例  

| Param | Type | Description |
| --- | --- | --- |
| tableName | <code>string</code> | 表名 |

<a name="module_@hyoga/mysql..Mysql+alias"></a>

#### mysql.alias(tableAlias) ⇒ <code>Mysql</code>
设置表的别名

**Kind**: instance method of [<code>Mysql</code>](#module_@hyoga/mysql..Mysql)  
**Returns**: <code>Mysql</code> - 实例  

| Param | Type | Description |
| --- | --- | --- |
| tableAlias | <code>string</code> | 主表别名 |

<a name="module_@hyoga/mysql..Mysql+field"></a>

#### mysql.field(fields) ⇒ <code>Mysql</code>
设置需要选取的字段，字符串或数组格式

**Kind**: instance method of [<code>Mysql</code>](#module_@hyoga/mysql..Mysql)  
**Returns**: <code>Mysql</code> - 实例  

| Param | Type | Description |
| --- | --- | --- |
| fields | <code>string</code> \| <code>Array</code> | 需要选取的字段 |

**Example**  
```js
// SELECT `admins`.`id`, `admins`.`name` FROM `admins` limit 1
mysql.table('admins').field('id, name').find();
// SELECT `admins`.`id`, `admins`.`name` as a, `admins`.`status` as b FROM `admins` limit 1
mysql.table('admins').field(['id', 'name as a', { status: 'b' }]).find();
```
<a name="module_@hyoga/mysql..Mysql+group"></a>

#### mysql.group(columns) ⇒ <code>Mysql</code>
group by 操作

**Kind**: instance method of [<code>Mysql</code>](#module_@hyoga/mysql..Mysql)  
**Returns**: <code>Mysql</code> - 实例  

| Param | Type | Description |
| --- | --- | --- |
| columns | <code>Array</code> \| <code>string</code> | 分组列名，可为数组或字符串，字符串以逗号分隔 |

<a name="module_@hyoga/mysql..Mysql+where"></a>

#### mysql.where(where) ⇒ <code>Mysql</code>
where条件设置，接受字符串或者对象形式，可以多次调用，每次调用都作为一个整体，多次调用使用 AND 连接

**Kind**: instance method of [<code>Mysql</code>](#module_@hyoga/mysql..Mysql)  
**Returns**: <code>Mysql</code> - 实例  

| Param | Type | Description |
| --- | --- | --- |
| where | <code>object</code> \| <code>string</code> | where条件 |

**Example**  
```js
// SELECT `admins`.`*` FROM `admins` WHERE (`admins`.`status` = 'on') limit 1
mysql.table('admins').where({ status: 'on' }).find();

// SELECT `admins`.`*` FROM `admins` WHERE (id = 10 OR id < 2) limit 1
mysql.table('admins').where('id = 10 OR id < 2').find();

// SELECT `admins`.`*` FROM `admins` WHERE (`admins`.`id` != 1) limit 1
mysql.table('admins').where({id: ['!=', 1]}).find();

// NULL操作

SELECT `admins`.`*` FROM `admins` WHERE (`admins`.`id` IS NULL) limit 1
mysql.table('admins').where({id: null}).find();

// SELECT `admins`.`*` FROM `admins` WHERE (`admins`.`id` IS NOT NULL) limit 1
mysql.table('admins').where({id: [ '!=', null ]}).find();

// LIKE 操作

// SELECT `admins`.`*` FROM `admins` WHERE (`admins`.`name` LIKE '%admin%') limit 1
mysql.table('admins').where({name: [ 'like', '%admin%' ]}).find();

// SELECT `admins`.`*` FROM `admins` WHERE (`admins`.`name` NOT LIKE '%admin%') limit 1
mysql.table('admins').where({name: [ 'notlike', '%admin%' ]}).find();

// SELECT `admins`.`*` FROM `admins` WHERE (`admins`.`name` LIKE '%admin%' OR `admins`.`email` LIKE '%admin%') limit 1
mysql.table('admins').where({'name|email': [ 'like', '%admin%' ]}).find();

// SELECT `admins`.`*` FROM `admins` WHERE (`admins`.`name` LIKE '%admin%' AND `admins`.`email` LIKE '%admin%') limit 1
mysql.table('admins').where({'name&email': [ 'like', '%admin%' ]}).find();

// 一对多操作
// SELECT `admins`.`*` FROM `admins` WHERE (`admins`.`name` = 'admin' OR `admins`.`name` = 'editor') limit 1
mysql.table('admins').where({name: [ '=', [ 'admin', 'editor' ] ]}).find();

// IN 操作
// SELECT `admins`.`*` FROM `admins` WHERE (`admins`.`id` IN (5,10)) limit 1
mysql.table('admins').where({'id': [ 'in', [5, 10] ]}).find();

// SELECT `admins`.`*` FROM `admins` WHERE (`admins`.`id` IN (5, 10)) limit 1
mysql.table('admins').where({'id': [ 'in', '5, 10' ]}).find();

// SELECT `admins`.`*` FROM `admins` WHERE (`admins`.`id` NOT IN (5,10)) limit 1
mysql.table('admins').where({'id': [ 'notin', [5, 10] ]}).find();

// BETWEEN 操作
// SELECT `admins`.`*` FROM `admins` WHERE (`admins`.`id` BETWEEN 5 AND 10) limit 1
mysql.table('admins').where({'id': [ 'between', [5, 10] ]}).find();

// SELECT `admins`.`*` FROM `admins` WHERE (`admins`.`id` BETWEEN 5 AND 10 AND `admins`.`name` = 'admin') limit 1
mysql.table('admins').where({'id': [ 'between', [5, 10] ], 'name': 'admin'}).find();

// SELECT `admins`.`*` FROM `admins` WHERE (`admins`.`id` BETWEEN 5 AND 10 OR `admins`.`name` = 'admin') limit 1 
mysql.table('admins').where({'id': [ 'between', [5, 10] ], 'name': 'admin', '_logic': 'OR'}).find();

// 多字段操作
// SELECT `admins`.`*` FROM `admins` WHERE (`admins`.`status` = 'on') AND (`admins`.`id` >= 1 AND `admins`.`id` <= 10) limit 1
mysql.table('admins').where({'status': 'on'}).where({'id': {'>=': 1, '<=': 10}}).find();

// SELECT `admins`.`*` FROM `admins` WHERE (`admins`.`status` = 'on') AND (`admins`.`id` >= 1 OR `admins`.`id` <= 10) limit 1
mysql.table('admins').where({'status': 'on'}).where({'id': {'>=': 1, '<=': 10, '_logic': 'OR'}}).find();
```
<a name="module_@hyoga/mysql..Mysql+limit"></a>

#### mysql.limit(limit) ⇒ <code>Mysql</code>
设置结果的条数限制

**Kind**: instance method of [<code>Mysql</code>](#module_@hyoga/mysql..Mysql)  
**Returns**: <code>Mysql</code> - 实例  

| Param | Type | Description |
| --- | --- | --- |
| limit | <code>number</code> | 结果的条数限制 |

<a name="module_@hyoga/mysql..Mysql+page"></a>

#### mysql.page(page, pageSize) ⇒ <code>Mysql</code>
分页操作

**Kind**: instance method of [<code>Mysql</code>](#module_@hyoga/mysql..Mysql)  
**Returns**: <code>Mysql</code> - 实例  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| page | <code>number</code> | <code>1</code> | 当前页数 |
| pageSize | <code>number</code> | <code>1</code> | 每页大小 |

<a name="module_@hyoga/mysql..Mysql+data"></a>

#### mysql.data(data) ⇒ <code>Mysql</code>
设置数据

**Kind**: instance method of [<code>Mysql</code>](#module_@hyoga/mysql..Mysql)  
**Returns**: <code>Mysql</code> - 实例  

| Param | Type | Description |
| --- | --- | --- |
| data | <code>object</code> | 数据 |

<a name="module_@hyoga/mysql..Mysql+order"></a>

#### mysql.order(order) ⇒ <code>Mysql</code>
排序

**Kind**: instance method of [<code>Mysql</code>](#module_@hyoga/mysql..Mysql)  
**Returns**: <code>Mysql</code> - 实例  

| Param | Type | Description |
| --- | --- | --- |
| order | <code>array</code> \| <code>string</code> | 排序 |

**Example**  
```js
// SELECT `article_categorys`.`*` FROM `article_categorys` ORDER BY id desc
mysql.table('article_categorys').order('id desc').select();

//SELECT `article_categorys`.`*` FROM `article_categorys` ORDER BY id desc, name asc
mysql.table('article_categorys').order([ 'id desc', 'name asc' ]).select();
```
<a name="module_@hyoga/mysql..Mysql+join"></a>

#### mysql.join(join) ⇒ <code>Mysql</code>
设置join条件，可以多次join

**Kind**: instance method of [<code>Mysql</code>](#module_@hyoga/mysql..Mysql)  
**Returns**: <code>Mysql</code> - 实例  

| Param | Type | Description |
| --- | --- | --- |
| join | <code>object</code> | join条件 |

**Example**  
```js
// SELECT `a`.`*`, `b`.`*` FROM `article_posts` as a LEFT JOIN `article_categorys` AS b ON (a.`category_id`=b.`id`) limit 1
mysql.table('article_posts').alias('a').field([ 'a.*', 'b.*' ]).join({
 article_categorys: {
   as: 'b',
   on: { category_id: 'id' }
 }
}).find();

// SELECT `a`.`*`, `article_categorys`.`*` FROM `article_posts` as a LEFT JOIN `article_categorys` ON (a.`category_id`=article_categorys.`id`) limit 1
mysql.table('article_posts').alias('a').field([ 'a.*', 'article_categorys.*' ]).join({
 article_categorys: {
   // as: 'b',
   on: { category_id: 'id' }
 }
}).find();
```
<a name="module_@hyoga/mysql..Mysql+find"></a>

#### mysql.find(where) ⇒ <code>Promise.&lt;any&gt;</code>
查找一条数据

**Kind**: instance method of [<code>Mysql</code>](#module_@hyoga/mysql..Mysql)  
**Returns**: <code>Promise.&lt;any&gt;</code> - 查询结果  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| where | <code>object</code> \| <code>string</code> | <code></code> | where条件 |

<a name="module_@hyoga/mysql..Mysql+select"></a>

#### mysql.select(where) ⇒ <code>Promise.&lt;any&gt;</code>
查找数据

**Kind**: instance method of [<code>Mysql</code>](#module_@hyoga/mysql..Mysql)  
**Returns**: <code>Promise.&lt;any&gt;</code> - 查询结果  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| where | <code>object</code> \| <code>string</code> | <code></code> | where条件 |

<a name="module_@hyoga/mysql..Mysql+update"></a>

#### mysql.update(column, where) ⇒ <code>Promise.&lt;any&gt;</code>
更新操作

**Kind**: instance method of [<code>Mysql</code>](#module_@hyoga/mysql..Mysql)  
**Returns**: <code>Promise.&lt;any&gt;</code> - 更新结果  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| column | <code>object</code> |  | {name: value} 更新的字段与值 |
| where | <code>object</code> \| <code>string</code> | <code></code> | where条件，参见[where]方法 |

<a name="module_@hyoga/mysql..Mysql+updateMany"></a>

#### mysql.updateMany(columnList, where) ⇒ <code>Promise.&lt;any&gt;</code>
一次性更新多条数据

**Kind**: instance method of [<code>Mysql</code>](#module_@hyoga/mysql..Mysql)  
**Returns**: <code>Promise.&lt;any&gt;</code> - 更新结果  

| Param | Type | Description |
| --- | --- | --- |
| columnList | <code>Array.&lt;object&gt;</code> | [{id: 1, name: value}] 更新的字段与值，必须包含主键 |
| where | <code>object</code> \| <code>string</code> | where条件，参见[where]方法 |

<a name="module_@hyoga/mysql..Mysql+increase"></a>

#### mysql.increase(field, step) ⇒ <code>Promise.&lt;any&gt;</code>
自增操作

**Kind**: instance method of [<code>Mysql</code>](#module_@hyoga/mysql..Mysql)  
**Returns**: <code>Promise.&lt;any&gt;</code> - 更新结果  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| field | <code>string</code> |  | 字段名 |
| step | <code>number</code> | <code>1</code> | 自增数，默认1 |

<a name="module_@hyoga/mysql..Mysql+decrement"></a>

#### mysql.decrement(field, step) ⇒ <code>Promise.&lt;any&gt;</code>
自减操作

**Kind**: instance method of [<code>Mysql</code>](#module_@hyoga/mysql..Mysql)  
**Returns**: <code>Promise.&lt;any&gt;</code> - 更新结果  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| field | <code>string</code> |  | 字段名 |
| step | <code>number</code> | <code>1</code> | 自减数，默认1 |

<a name="module_@hyoga/mysql..Mysql+add"></a>

#### mysql.add(column, duplicate) ⇒ <code>Promise.&lt;any&gt;</code>
新增数据

**Kind**: instance method of [<code>Mysql</code>](#module_@hyoga/mysql..Mysql)  
**Returns**: <code>Promise.&lt;any&gt;</code> - 操作结果  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| column | <code>object</code> |  | 字段键值对 |
| duplicate | <code>object</code> | <code>false</code> | 出现重复则更新，{id : 100, name : VALUES('test')} |

<a name="module_@hyoga/mysql..Mysql+addMany"></a>

#### mysql.addMany(columnList, duplicate) ⇒ <code>Promise.&lt;any&gt;</code>
批量新增数据

**Kind**: instance method of [<code>Mysql</code>](#module_@hyoga/mysql..Mysql)  
**Returns**: <code>Promise.&lt;any&gt;</code> - 操作结果  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| columnList | <code>object</code> |  | 字段键值对数组 |
| duplicate | <code>object</code> | <code>false</code> | 出现重复则更新，{id : 100, name : VALUES('test')} |

<a name="module_@hyoga/mysql..Mysql+delete"></a>

#### mysql.delete(where) ⇒ <code>Promise.&lt;any&gt;</code>
删除操作，彻底删除一条数据，一般不建议删除数据，可以通过字段开关控制

**Kind**: instance method of [<code>Mysql</code>](#module_@hyoga/mysql..Mysql)  
**Returns**: <code>Promise.&lt;any&gt;</code> - 操作结果  

| Param | Type | Description |
| --- | --- | --- |
| where | <code>object</code> \| <code>string</code> | where条件，参见[where]方法 |

<a name="module_@hyoga/mysql..Mysql+_sql"></a>

#### mysql.\_sql() ⇒ <code>string</code>
打印生成的sql语句，用于调试

**Kind**: instance method of [<code>Mysql</code>](#module_@hyoga/mysql..Mysql)  
**Returns**: <code>string</code> - 生成的sql语句  
