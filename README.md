# hyoga-mysql
一个MYSQL数据库的常用操作封装，操作方式类似THINKPHP的数据库操作  

## 安装
```javascriipt
npm i @hyoga/mysql
```
## 使用
```javascriipt
const mysql = require('@hyoga/mysql');
const inst = new mysql({
  host: '127.0.0.1',
  user: 'root',
  password: '',
  database: 'test-db',
  port: 3306,
});
const users = await inst.table('user').where({ status: 1 }).select();
console.log(users);
```

## API
Mysql数据库实例，封装了常用操作方式

**Kind**: global class  

* [Mysql](#Mysql)
    * [new Mysql(config)](#new_Mysql_new)
    * [.query(sql)](#Mysql+query) ⇒ <code>Promise.&lt;any&gt;</code>
    * [.table(tableName)](#Mysql+table) ⇒ [<code>Mysql</code>](#Mysql)
    * [.alias(tableAlias)](#Mysql+alias) ⇒ [<code>Mysql</code>](#Mysql)
    * [.field(fields)](#Mysql+field) ⇒ [<code>Mysql</code>](#Mysql)
    * [.group(collums)](#Mysql+group) ⇒ [<code>Mysql</code>](#Mysql)
    * [.where(where)](#Mysql+where) ⇒ [<code>Mysql</code>](#Mysql)
    * [.limit(limit)](#Mysql+limit) ⇒ [<code>Mysql</code>](#Mysql)
    * [.page(page, pageSize)](#Mysql+page) ⇒ [<code>Mysql</code>](#Mysql)
    * [.data(data)](#Mysql+data) ⇒ [<code>Mysql</code>](#Mysql)
    * [.order(order)](#Mysql+order) ⇒ [<code>Mysql</code>](#Mysql)
    * [.join(join)](#Mysql+join) ⇒ [<code>Mysql</code>](#Mysql)
    * [.find(where)](#Mysql+find) ⇒ <code>Promise.&lt;any&gt;</code>
    * [.select(where)](#Mysql+select) ⇒ <code>Promise.&lt;any&gt;</code>
    * [.update(collum)](#Mysql+update) ⇒ <code>Promise.&lt;any&gt;</code>
    * [.increase(field, step)](#Mysql+increase) ⇒ <code>Promise.&lt;any&gt;</code>
    * [.decrement(field, step)](#Mysql+decrement) ⇒ <code>Promise.&lt;any&gt;</code>
    * [.add(collum, duplicate)](#Mysql+add) ⇒ <code>Promise.&lt;any&gt;</code>
    * [.delete()](#Mysql+delete) ⇒ <code>Promise.&lt;any&gt;</code>
    * [._getConnection()](#Mysql+_getConnection) ⇒ <code>Mysql.connection</code>
    * [._connect()](#Mysql+_connect) ⇒ <code>void</code>
    * [._close()](#Mysql+_close) ⇒ <code>void</code>
    * [._resetParams()](#Mysql+_resetParams) ⇒ <code>void</code>
    * [._formatFields()](#Mysql+_formatFields) ⇒ <code>string</code>
    * [._formatFieldsName(field)](#Mysql+_formatFieldsName) ⇒ <code>string</code>
    * [._formatJoin()](#Mysql+_formatJoin) ⇒ <code>string</code>
    * [._formatWhere()](#Mysql+_formatWhere) ⇒ <code>string</code>
    * [._sql()](#Mysql+_sql) ⇒ <code>string</code>

<a name="new_Mysql_new"></a>

### new Mysql(config)
创建Mysql实例


| Param | Type | Description |
| --- | --- | --- |
| config | <code>object</code> | 数据库连接配置 |

<a name="Mysql+query"></a>

### mysql.query(sql) ⇒ <code>Promise.&lt;any&gt;</code>
直接执行sql语句

**Kind**: instance method of [<code>Mysql</code>](#Mysql)  
**Returns**: <code>Promise.&lt;any&gt;</code> - sql执行结果  

| Param | Type | Description |
| --- | --- | --- |
| sql | <code>string</code> | sql语句 |

<a name="Mysql+table"></a>

### mysql.table(tableName) ⇒ [<code>Mysql</code>](#Mysql)
设置表名

**Kind**: instance method of [<code>Mysql</code>](#Mysql)  
**Returns**: [<code>Mysql</code>](#Mysql) - 实例  

| Param | Type | Description |
| --- | --- | --- |
| tableName | <code>string</code> | 表名 |

<a name="Mysql+alias"></a>

### mysql.alias(tableAlias) ⇒ [<code>Mysql</code>](#Mysql)
设置表的别名

**Kind**: instance method of [<code>Mysql</code>](#Mysql)  
**Returns**: [<code>Mysql</code>](#Mysql) - 实例  

| Param | Type | Description |
| --- | --- | --- |
| tableAlias | <code>string</code> | 主表别名 |

<a name="Mysql+field"></a>

### mysql.field(fields) ⇒ [<code>Mysql</code>](#Mysql)
设置需要选取的字段，字符串或数组格式

**Kind**: instance method of [<code>Mysql</code>](#Mysql)  
**Returns**: [<code>Mysql</code>](#Mysql) - 实例  

| Param | Type | Description |
| --- | --- | --- |
| fields | <code>string</code> \| <code>Array</code> | 需要选取的字段 		1、'a, b, c' 		2、['a', 'b', {'c': 'd'}] |

<a name="Mysql+group"></a>

### mysql.group(collums) ⇒ [<code>Mysql</code>](#Mysql)
group by 操作

**Kind**: instance method of [<code>Mysql</code>](#Mysql)  
**Returns**: [<code>Mysql</code>](#Mysql) - 实例  

| Param | Type | Description |
| --- | --- | --- |
| collums | <code>Array</code> \| <code>string</code> | 分组列名，可为数组或字符串，字符串以逗号分隔 |

<a name="Mysql+where"></a>

### mysql.where(where) ⇒ [<code>Mysql</code>](#Mysql)
where条件设置

**Kind**: instance method of [<code>Mysql</code>](#Mysql)  
**Returns**: [<code>Mysql</code>](#Mysql) - 实例  

| Param | Type | Description |
| --- | --- | --- |
| where | <code>object</code> \| <code>string</code> | where条件  'field = 10'  {'field': 10} 	{'field': {">":10}},{'field': {"like":10}} 	{'field': {">":10,'_logic':'or'}} 	{'field': {"=": 'select id from a where name="zhangsan"','_isSql':true}} |

<a name="Mysql+limit"></a>

### mysql.limit(limit) ⇒ [<code>Mysql</code>](#Mysql)
设置结果的条数限制

**Kind**: instance method of [<code>Mysql</code>](#Mysql)  
**Returns**: [<code>Mysql</code>](#Mysql) - 实例  

| Param | Type | Description |
| --- | --- | --- |
| limit | <code>number</code> | 结果的条数限制 |

<a name="Mysql+page"></a>

### mysql.page(page, pageSize) ⇒ [<code>Mysql</code>](#Mysql)
分页操作

**Kind**: instance method of [<code>Mysql</code>](#Mysql)  
**Returns**: [<code>Mysql</code>](#Mysql) - 实例  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| page | <code>number</code> | <code>1</code> | 当前页数 |
| pageSize | <code>number</code> | <code>1</code> | 每页大小 |

<a name="Mysql+data"></a>

### mysql.data(data) ⇒ [<code>Mysql</code>](#Mysql)
设置数据

**Kind**: instance method of [<code>Mysql</code>](#Mysql)  
**Returns**: [<code>Mysql</code>](#Mysql) - 实例  

| Param | Type | Description |
| --- | --- | --- |
| data | <code>object</code> | 数据 |

<a name="Mysql+order"></a>

### mysql.order(order) ⇒ [<code>Mysql</code>](#Mysql)
排序

**Kind**: instance method of [<code>Mysql</code>](#Mysql)  
**Returns**: [<code>Mysql</code>](#Mysql) - 实例  

| Param | Type | Description |
| --- | --- | --- |
| order | <code>array</code> \| <code>string</code> | 排序 |

<a name="Mysql+join"></a>

### mysql.join(join) ⇒ [<code>Mysql</code>](#Mysql)
设置join条件，可以多次join

**Kind**: instance method of [<code>Mysql</code>](#Mysql)  
**Returns**: [<code>Mysql</code>](#Mysql) - 实例  

| Param | Type | Description |
| --- | --- | --- |
| join | <code>object</code> | join条件 {   cate: {   	 join: "left", // 有 left、right和inner 3 个值，默认left     as: "c",     on: { id: "id", uid: "uid" }   } } |

<a name="Mysql+find"></a>

### mysql.find(where) ⇒ <code>Promise.&lt;any&gt;</code>
查找一条数据

**Kind**: instance method of [<code>Mysql</code>](#Mysql)  
**Returns**: <code>Promise.&lt;any&gt;</code> - 查询结果  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| where | <code>object</code> \| <code>string</code> | <code></code> | where条件 |

<a name="Mysql+select"></a>

### mysql.select(where) ⇒ <code>Promise.&lt;any&gt;</code>
查找数据

**Kind**: instance method of [<code>Mysql</code>](#Mysql)  
**Returns**: <code>Promise.&lt;any&gt;</code> - 查询结果  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| where | <code>object</code> \| <code>string</code> | <code></code> | where条件 |

<a name="Mysql+update"></a>

### mysql.update(collum) ⇒ <code>Promise.&lt;any&gt;</code>
更新操作

**Kind**: instance method of [<code>Mysql</code>](#Mysql)  
**Returns**: <code>Promise.&lt;any&gt;</code> - 更新结果  

| Param | Type | Description |
| --- | --- | --- |
| collum | <code>object</code> | {name: value} 更新的字段与值 |

<a name="Mysql+increase"></a>

### mysql.increase(field, step) ⇒ <code>Promise.&lt;any&gt;</code>
自增操作

**Kind**: instance method of [<code>Mysql</code>](#Mysql)  
**Returns**: <code>Promise.&lt;any&gt;</code> - 更新结果  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| field | <code>string</code> |  | 字段名 |
| step | <code>number</code> | <code>1</code> | 自增数，默认1 |

<a name="Mysql+decrement"></a>

### mysql.decrement(field, step) ⇒ <code>Promise.&lt;any&gt;</code>
自减操作

**Kind**: instance method of [<code>Mysql</code>](#Mysql)  
**Returns**: <code>Promise.&lt;any&gt;</code> - 更新结果  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| field | <code>string</code> |  | 字段名 |
| step | <code>number</code> | <code>1</code> | 自减数，默认1 |

<a name="Mysql+add"></a>

### mysql.add(collum, duplicate) ⇒ <code>Promise.&lt;any&gt;</code>
新增数据

**Kind**: instance method of [<code>Mysql</code>](#Mysql)  
**Returns**: <code>Promise.&lt;any&gt;</code> - 操作结果  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| collum | <code>object</code> |  | 列字段 |
| duplicate | <code>object</code> | <code>false</code> | 出现重复则更新，{key : 'c', value : VALUES('123')} |

<a name="Mysql+delete"></a>

### mysql.delete() ⇒ <code>Promise.&lt;any&gt;</code>
删除操作，彻底删除一条数据，一般不建议删除数据，可以通过字段开关控制

**Kind**: instance method of [<code>Mysql</code>](#Mysql)  
**Returns**: <code>Promise.&lt;any&gt;</code> - 操作结果  
<a name="Mysql+_getConnection"></a>

### mysql.\_getConnection() ⇒ <code>Mysql.connection</code>
获取数据连接

**Kind**: instance method of [<code>Mysql</code>](#Mysql)  
**Returns**: <code>Mysql.connection</code> - 数据库连接对象  
<a name="Mysql+_connect"></a>

### mysql.\_connect() ⇒ <code>void</code>
获取数据库连接对象

**Kind**: instance method of [<code>Mysql</code>](#Mysql)  
<a name="Mysql+_close"></a>

### mysql.\_close() ⇒ <code>void</code>
关闭数据库连接

**Kind**: instance method of [<code>Mysql</code>](#Mysql)  
<a name="Mysql+_resetParams"></a>

### mysql.\_resetParams() ⇒ <code>void</code>
重置查询条件，每次查询完必须重置

**Kind**: instance method of [<code>Mysql</code>](#Mysql)  
<a name="Mysql+_formatFields"></a>

### mysql.\_formatFields() ⇒ <code>string</code>
需要选择的字段名处理

**Kind**: instance method of [<code>Mysql</code>](#Mysql)  
**Returns**: <code>string</code> - 需要选择的字段拼接结果  
<a name="Mysql+_formatFieldsName"></a>

### mysql.\_formatFieldsName(field) ⇒ <code>string</code>
字段名处理，添加``，防止报错

**Kind**: instance method of [<code>Mysql</code>](#Mysql)  
**Returns**: <code>string</code> - 字段名处理结果  

| Param | Type | Description |
| --- | --- | --- |
| field | <code>string</code> | 字段名 |

<a name="Mysql+_formatJoin"></a>

### mysql.\_formatJoin() ⇒ <code>string</code>
join操作处理，转变为join语句

**Kind**: instance method of [<code>Mysql</code>](#Mysql)  
**Returns**: <code>string</code> - join操作的拼接结果  
<a name="Mysql+_formatWhere"></a>

### mysql.\_formatWhere() ⇒ <code>string</code>
where条件处理

**Kind**: instance method of [<code>Mysql</code>](#Mysql)  
**Returns**: <code>string</code> - where条件的拼接结果  
<a name="Mysql+_sql"></a>

### mysql.\_sql() ⇒ <code>string</code>
打印生成的sql语句，用于调试

**Kind**: instance method of [<code>Mysql</code>](#Mysql)  
**Returns**: <code>string</code> - 生成的sql语句  
