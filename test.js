const Mysql = require('./dist/mysql').default;

const client1 = new Mysql({
  host: '127.0.0.1',
  user: 'root',
  password: '123456',
  database: 'db1',
});

const client2 = new Mysql({
  host: '127.0.0.1',
  user: 'root',
  password: '123456',
  database: 'db2',
});

console.log(client1, client2);