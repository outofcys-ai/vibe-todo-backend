// 진입점 파일 — Express 서버 실행 및 MongoDB 연결

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const todoCreateRouter = require('./routes/todoCreate');
const todoGetRouter = require('./routes/todoGet');
const todoDeleteRouter = require('./routes/todoDelete');
const todoUpdateRouter = require('./routes/todoUpdate');

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const HOST = process.env.HOST || '0.0.0.0';
const MONGO_URI =
  process.env.MONGO_URI || 'mongodb://localhost:27017/todo-mogodb';

app.use(cors());
app.use(express.json());

// Cloudtype 등 K8s startup probe — DB 연결 전에도 200을 줘야 함
app.get('/healthz', (_req, res) => {
  res.status(200).send('ok');
});

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('데이터 베이스 연결성공');
    app.use('/api/todos', todoCreateRouter);
    app.use('/api/todos', todoGetRouter);
    app.use('/api/todos', todoDeleteRouter);
    app.use('/api/todos', todoUpdateRouter);
  })
  .catch((err) => {
    console.error('MongoDB 연결 실패:', err.message);
  });

app.listen(PORT, HOST, () => {
  console.log(`서버 실행 중: http://${HOST}:${PORT}`);
});
