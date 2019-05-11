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

  it ('when {where} not set should return all collums', async function() {
    const data = await mysql.table('admins').find();
    expect(data).to.include.keys('id');
  });

  it ('when {where} was set should return correct row', async function() {
    const data = await mysql.table('admins').find({ id: 1 });
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
    const data1 = await mysql.table('admins').where({ status: 'on' }).find();
    expect(data1).to.have.any.keys({ id: 1 });
    const data2 = await mysql.table('article_catgorys').where({ id: { '>': 1 } }).find();
    expect(data2.id).to.be.above(1);
  });
});

describe('field', function() {
  it ('when {field} was set should only return correct collums', async function() {
    const data1 = await mysql.table('admins').field('id, name').find();
    expect(data1).to.have.any.keys('id', 'name');
    const data2 = await mysql.table('admins').field(['id', 'name as a', { status: 'b' }]).find();
    expect(data2).to.have.any.keys('id', 'a', 'b');
  });
});

describe('limit', function() {
  it ('when {limit} was set should only return ${limit} items', async function() {
    const data = await mysql.table('article_catgorys').limit(2).select();
    expect(data).to.have.lengthOf(2);
  });
});

describe('page', function () {
  it('when {page} was set should only return ${offser}, ${limit} items', async function () {
    const data = await mysql.table('article_catgorys').page(2, 2).select();
    expect(data).to.have.lengthOf(2);
    expect(data[0]).to.have.any.keys({ id: 3 });
  });
});

describe('order', function () {
  it('when {order} was set should only return correct order items', async function () {
    const data1 = await mysql.table('article_catgorys').order('id desc').select();
    expect(data1[0].id).to.be.above(data1[1].id);
    const data2 = await mysql.table('article_catgorys').order([ 'id desc', 'name asc' ]).select();
    expect(data2[0].id).to.be.above(data2[1].id);
  });
});

describe('join', function () {
  it('when {join} was set should only return correct join items', async function () {
    const data1 = await mysql.table('article_post')
      .alias('a')
      .field([ 'a.*', 'b.*' ])
      .join({
        article_catgorys: {
          as: 'b',
          on: { catgory_id: 'id' }
        }
      })
      .find();
    expect(data1).to.include.keys('name');
    const data2 = await mysql.table('article_post')
      .alias('a')
      .field([ 'a.*', 'article_catgorys.*' ])
      .join({
        article_catgorys: {
          // as: 'b',
          on: { catgory_id: 'id' }
        }
      })
      .find();
    expect(data2).to.include.keys('name');
  });
});

describe('add', function () {
  it('when {add} oprate should add the correct rows', async function () {
    let insertId = 0;
    after(async function () {
      await mysql.table('article_catgorys').delete({ id: insertId });
    });
    const data1 = await mysql.table('article_catgorys').add({ name: '测试add' });
    expect(data1).to.have.any.keys({ affectedRows: 1 });
    insertId = data1.insertId;
  });
});

describe('delete', function () {
  it('when {delete} oprate should delete the correct rows', async function () {
    let insertId = 0;
    before(async function () {
      const data1 = await mysql.table('article_catgorys').add({ name: '测试delete' });
      insertId = data1.insertId;
    });
    await mysql.table('article_catgorys').delete({ id: insertId });
    const data1 = await mysql.table('article_catgorys').find({ id: insertId });
    expect(data1).to.be.undefined;
  });
});

describe('update', function () {
  it('when {update} oprate should update the correct rows', async function () {
    after(async function () {
      await mysql.table('article_catgorys').update({ name: '测试数据' }, { id: 4 });
      await mysql.table('article_catgorys').update({ name: '测试数据' }, { id: 5 });
    });
    const data1 = await mysql.table('article_catgorys').update({ name: '测试update' }, { id: 4 });
    expect(data1).to.have.any.keys({ affectedRows: 1 });
    const data2 = await mysql.table('article_catgorys').where({ id: 4 }).find();
    expect(data2).to.have.any.keys({ name: '测试update' });
    const data3 = await mysql.table('article_catgorys').where({ id: 5 }).update({ name: '测试update' });
    expect(data3).to.have.any.keys({ affectedRows: 1 });
    const data4 = await mysql.table('article_catgorys').where({ id: 5 }).find();
    expect(data4).to.have.any.keys({ name: '测试update' });
  });
});
