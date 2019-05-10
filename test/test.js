const Mysql = require('../libs/mysql');
const chai = require('chai') ,
  expect = chai.expect ,
  should = chai.should()

const config = {
  host: '127.0.0.1',
  user: 'root',
  password: 'luo1872053',
  database: 'pet-cms',
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
  it ('when table not set should throw error', async function() {
    // expect(mysql.find.bind(mysql)).to.throw(Error);
  });

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
  it ('when table not set should throw error', async function() {
    // expect(mysql.find.bind(mysql)).to.throw(Error);
  });

  it ('when {where} was set should return correct row(s)', async function() {
    const data1 = await mysql.table('admins').where({ status: 'on' }).find();
    expect(data1).to.have.any.keys({ id: 1 });
    const data2 = await mysql.table('article_catgorys').where({ id: { '>': 1 } }).find();
    expect(data2.id).to.be.above(1);
  });
});

describe('field', function() {
  it ('when table not set should throw error', async function() {
    // expect(mysql.find.bind(mysql)).to.throw(Error);
  });

  it ('when {field} was set should only return correct collums', async function() {
    const data1 = await mysql.table('admins').field('id, name').find();
    expect(data1).to.have.any.keys('id', 'name');
    const data2 = await mysql.table('admins').field(['id', 'name as a', { status: 'b' }]).find();
    expect(data2).to.have.any.keys('id', 'a', 'b');
  });
});

describe('limit', function() {
  it ('when table not set should throw error', async function() {
    // expect(mysql.find.bind(mysql)).to.throw(Error);
  });

  it ('when {limit} was set should only return ${limit} items', async function() {
    const data = await mysql.table('article_catgorys').limit(2).select();
    expect(data).to.have.lengthOf(2);
  });
});
