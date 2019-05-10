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

  it ('when {where} has set should return correct row', async function() {
    const data = await mysql.table('admins').find({ id: 1 });
    expect(data).to.have.any.keys({ id: 1 })
  });
});
