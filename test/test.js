const Mysql = require('../libs/mysql');
const chai = require('chai') ,
  expect = chai.expect;

const config = {
  host: '127.0.0.1',
  user: 'root',
  password: '',
  database: 'test-db',
  port: 3306,
};
const mysql = new Mysql(config);

describe('connection', function() {
  it ('when connect should not throw error', function() {
    expect(mysql._getConnection.bind(mysql)).to.not.throw(Error);
  });
});

describe('find row', function() {
  it ('when table not set should throw error', async function() {
    // expect(mysql.find.bind(mysql)).to.throw(Error);
  });

  it ('when {where} not set should return all columns', async function() {
    const data = await mysql.table('admins').find();
    expect(data).to.include.keys('id');
  });

  it ('when {where} was set should return correct row', async function() {
    const data = await mysql.table('admins').find({ id: 1 });
    _sql = mysql._sql();
    console.log(_sql);
    expect(data).to.have.any.keys({ id: 1 });
  });
});

describe('select rows', function() {
  it ('should retrun data as array', async function() {
    const data = await mysql.table('admins').select();
    expect(data).to.be.a('array');
  });

  it ('when {where} was set should return correct rows', async function() {
    const data = await mysql.table('admins').select({ id: 1 });
    expect(data).to.be.a('array');
    expect(data[0]).to.have.any.keys({ id: 1 });
  });
});

describe('where', function() {
  it ('when {where} was set should return correct row(s)', async function() {
    await mysql.table('admins').where({ status: 'on' }).find();
    const sql1 = mysql._sql();
    expect(sql1).to.be.eql("SELECT `admins`.`*` FROM `admins` WHERE (`admins`.`status` = 'on') limit 1");

    await mysql.table('admins').where('id = 10 OR id < 2').find();
    const sql2 = mysql._sql();
    expect(sql2).to.be.eql("SELECT `admins`.`*` FROM `admins` WHERE (id = 10 OR id < 2) limit 1");

    await mysql.table('admins').where({id: ['!=', 1]}).find();
    const sql3 = mysql._sql();
    expect(sql3).to.be.eql("SELECT `admins`.`*` FROM `admins` WHERE (`admins`.`id` != 1) limit 1");

    await mysql.table('admins').where({id: null}).find();
    const sql4 = mysql._sql();
    expect(sql4).to.be.eql("SELECT `admins`.`*` FROM `admins` WHERE (`admins`.`id` IS NULL) limit 1");

    await mysql.table('admins').where({id: [ '!=', null ]}).find();
    const sql5 = mysql._sql();
    expect(sql5).to.be.eql("SELECT `admins`.`*` FROM `admins` WHERE (`admins`.`id` IS NOT NULL) limit 1");

    await mysql.table('admins').where({name: [ 'like', '%admin%' ]}).find();
    const sql6 = mysql._sql();
    expect(sql6).to.be.eql("SELECT `admins`.`*` FROM `admins` WHERE (`admins`.`name` LIKE '%admin%') limit 1");

    await mysql.table('admins').where({name: [ '=', [ 'admin', 'editor' ] ]}).find();
    const sql7 = mysql._sql();
    expect(sql7).to.be.eql("SELECT `admins`.`*` FROM `admins` WHERE (`admins`.`name` = 'admin' OR `admins`.`name` = 'editor') limit 1");

    await mysql.table('admins').where({name: [ 'notlike', '%admin%' ]}).find();
    const sql8 = mysql._sql();
    expect(sql8).to.be.eql("SELECT `admins`.`*` FROM `admins` WHERE (`admins`.`name` NOT LIKE '%admin%') limit 1");

    await mysql.table('admins').where({'name|email': [ 'like', '%admin%' ]}).find();
    const sql9 = mysql._sql();
    expect(sql9).to.be.eql("SELECT `admins`.`*` FROM `admins` WHERE (`admins`.`name` LIKE '%admin%' OR `admins`.`email` LIKE '%admin%') limit 1");

    await mysql.table('admins').where({'name&email': [ 'like', '%admin%' ]}).find();
    const sql10 = mysql._sql();
    expect(sql10).to.be.eql("SELECT `admins`.`*` FROM `admins` WHERE (`admins`.`name` LIKE '%admin%' AND `admins`.`email` LIKE '%admin%') limit 1");

    await mysql.table('admins').where({'id': [ 'in', [5, 10] ]}).find();
    const sql11 = mysql._sql();
    expect(sql11).to.be.eql("SELECT `admins`.`*` FROM `admins` WHERE (`admins`.`id` IN (5,10)) limit 1");

    await mysql.table('admins').where({'id': [ 'in', '5, 10' ]}).find();
    const sql12 = mysql._sql();
    expect(sql12).to.be.eql("SELECT `admins`.`*` FROM `admins` WHERE (`admins`.`id` IN (5, 10)) limit 1");

    await mysql.table('admins').where({'id': [ 'notin', [5, 10] ]}).find();
    const sql13 = mysql._sql();
    expect(sql13).to.be.eql("SELECT `admins`.`*` FROM `admins` WHERE (`admins`.`id` NOT IN (5,10)) limit 1");

    await mysql.table('admins').where({'id': [ 'not in', [5, 10] ]}).find();
    const sql14 = mysql._sql();
    expect(sql14).to.be.eql("SELECT `admins`.`*` FROM `admins` WHERE (`admins`.`id` NOT IN (5,10)) limit 1");

    await mysql.table('admins').where({'id': [ 'between', [5, 10] ]}).find();
    const sql15 = mysql._sql();
    expect(sql15).to.be.eql("SELECT `admins`.`*` FROM `admins` WHERE (`admins`.`id` BETWEEN 5 AND 10) limit 1");

    await mysql.table('admins').where({'id': [ 'between', [5, 10] ], 'name': 'admin'}).find();
    const sql16 = mysql._sql();
    expect(sql16).to.be.eql("SELECT `admins`.`*` FROM `admins` WHERE (`admins`.`id` BETWEEN 5 AND 10 AND `admins`.`name` = 'admin') limit 1");
    
    await mysql.table('admins').where({'id': [ 'between', [5, 10] ], 'name': 'admin', '_logic': 'OR'}).find();
    const sql17 = mysql._sql();
    expect(sql17).to.be.eql("SELECT `admins`.`*` FROM `admins` WHERE (`admins`.`id` BETWEEN 5 AND 10 OR `admins`.`name` = 'admin') limit 1");

    await mysql.table('admins').where({'status': 'on'}).where({'id': {'>=': 1, '<=': 10}}).find();
    const sql18 = mysql._sql();
    expect(sql18).to.be.eql("SELECT `admins`.`*` FROM `admins` WHERE (`admins`.`status` = 'on') AND (`admins`.`id` >= 1 AND `admins`.`id` <= 10) limit 1");

    await mysql.table('admins').where({'status': 'on'}).where({'id': {'>=': 1, '<=': 10, '_logic': 'OR'}}).find();
    const sql19 = mysql._sql();
    expect(sql19).to.be.eql("SELECT `admins`.`*` FROM `admins` WHERE (`admins`.`status` = 'on') AND (`admins`.`id` >= 1 OR `admins`.`id` <= 10) limit 1");
  });
});

describe('field', function() {
  it ('when {field} was set should only return correct columns', async function() {
    const data1 = await mysql.table('admins').field('id, name').find();
    expect(data1).to.have.any.keys('id', 'name');
    const data2 = await mysql.table('admins').field(['id', 'name as a', { status: 'b' }]).find();
    expect(data2).to.have.any.keys('id', 'a', 'b');
  });
});

describe('limit', function() {
  it ('when {limit} was set should only return ${limit} items', async function() {
    const data = await mysql.table('article_categorys').limit(2).select();
    expect(data).to.have.lengthOf(2);
  });
});

describe('page', function () {
  it('when {page} was set should only return ${offset}, ${limit} items', async function () {
    const data = await mysql.table('article_categorys').page(2, 2).select();
    expect(data).to.have.lengthOf(2);
    expect(data[0]).to.have.any.keys({ id: 3 });
  });
});

describe('order', function () {
  it('when {order} was set should only return correct order items', async function () {
    const data1 = await mysql.table('article_categorys').order('id desc').select();
    expect(data1[0].id).to.be.above(data1[1].id);
    const data2 = await mysql.table('article_categorys').order([ 'id desc', 'name asc' ]).select();
    expect(data2[0].id).to.be.above(data2[1].id);
  });
});

describe('join', function () {
  it('when {join} was set should only return correct join items', async function () {
    const data1 = await mysql.table('article_posts')
      .alias('a')
      .field([ 'a.*', 'b.*' ])
      .join({
        article_categorys: {
          as: 'b',
          on: { category_id: 'id' }
        }
      })
      .find();
    expect(data1).to.include.keys('name');
    const data2 = await mysql.table('article_posts')
      .alias('a')
      .field([ 'a.*', 'article_categorys.*' ])
      .join({
        article_categorys: {
          // as: 'b',
          on: { category_id: 'id' }
        }
      })
      .find();
    expect(data2).to.include.keys('name');
  });
});

describe('add', function () {
  it('when {add} operate should add the correct rows', async function () {
    let insertId = 0;
    after(async function () {
      await mysql.table('article_categorys').delete({ id: insertId });
    });
    const data1 = await mysql.table('article_categorys').add({ name: '测试add' });
    expect(data1).to.have.any.keys({ affectedRows: 1 });
    insertId = data1.insertId;
  });
});

describe('delete', function () {
  it('when {delete} operate should delete the correct rows', async function () {
    let insertId = 0;
    before(async function () {
      const data1 = await mysql.table('article_categorys').add({ name: '测试delete' });
      insertId = data1.insertId;
    });
    await mysql.table('article_categorys').delete({ id: insertId });
    const data1 = await mysql.table('article_categorys').find({ id: insertId });
    expect(data1).to.be.undefined;
  });
});

describe('update', function () {
  it('when {update} operate should update the correct rows', async function () {
    after(async function () {
      await mysql.table('article_categorys').update({ name: '测试数据' }, { id: 4 });
      await mysql.table('article_categorys').update({ name: '测试数据' }, { id: 5 });
    });
    const data1 = await mysql.table('article_categorys').update({ name: '测试update' }, { id: 4 });
    expect(data1).to.have.any.keys({ affectedRows: 1 });
    const data2 = await mysql.table('article_categorys').where({ id: 4 }).find();
    expect(data2).to.have.any.keys({ name: '测试update' });
    const data3 = await mysql.table('article_categorys').where({ id: 5 }).update({ name: '测试update' });
    expect(data3).to.have.any.keys({ affectedRows: 1 });
    const data4 = await mysql.table('article_categorys').where({ id: 5 }).find();
    expect(data4).to.have.any.keys({ name: '测试update' });
  });
});

describe('updateMany', function () {
  it('when {updateMany} operate should update the correct rows', async function () {
    after(async function () {
      await mysql.table('article_categorys').update({ name: '测试数据' }, { id: 4 });
    });
    const data1 = await mysql.table('article_categorys').update({ name: '测试update' }, { id: 4 });
    expect(data1).to.have.any.keys({ affectedRows: 1 });
    const data2 = await mysql.table('article_categorys').where({ id: 4 }).find();
    expect(data2).to.have.any.keys({ name: '测试update' });
    const data3 = await mysql.table('article_categorys').where({ id: 5 }).update({ name: '测试update' });
    expect(data3).to.have.any.keys({ affectedRows: 1 });
    const data4 = await mysql.table('article_categorys').where({ id: 5 }).find();
    expect(data4).to.have.any.keys({ name: '测试update' });
  });
});
