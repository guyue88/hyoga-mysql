/* eslint-disable */

const Mysql = require('../dist/mysql').default;

const config = {
  host: '127.0.0.1',
  user: 'root',
  password: '123456',
  database: 'test-db',
  port: 3307,
};

const mysql = new Mysql(config);

(async () => {
  // await mysql.table('article_posts').where({ id: 1 }).increase('category_id', 2);
  // console.log(mysql._sql());
  // await mysql.table('article_posts').where({ id: 1 }).decrement('category_id', 3);
  // console.log(mysql._sql());
  await mysql.table('article_posts').where({ id: 1 }).update({ category_id: -3 });
  console.log(mysql._sql());
})();
