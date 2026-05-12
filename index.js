// 진입점 파일 — Express 서버 실행 및 MongoDB 연결
// Cloudtype startup probe: listen 전에 무거운 require(mongoose, routes)를 두지 않음

require('dotenv').config();
const express = require('express');

const app = express();
// Cloudtype 헬스체크는 "배포 설정의 HTTP 포트"(예: 3000)로 들어옵니다.
// 환경변수 PORT를 5000 등으로 넣으면 앱만 다른 포트에서 떠서 startup probe가 실패합니다.
const rawPort = process.env.PORT;
const parsed = Number(rawPort);
const PORT =
  rawPort !== undefined && rawPort !== '' && Number.isFinite(parsed) && parsed > 0
    ? parsed
    : 3000;
const HOST = process.env.HOST || '0.0.0.0';
const MONGO_URI =
  process.env.MONGO_URI || 'mongodb://localhost:27017/todo-mogodb';

console.log(
  '[boot] PORT=%s (process.env.PORT=%s) HOST=%s',
  PORT,
  JSON.stringify(process.env.PORT),
  HOST
);

app.get('/', (_req, res) => {
  res.status(200).json({
    name: 'vibe-todo-backend',
    health: '/healthz',
    todos: '/api/todos',
  });
});

app.get('/healthz', (_req, res) => {
  res.status(200).send('ok');
});

app
  .listen(PORT, HOST, () => {
    console.log(`서버 실행 중: http://${HOST}:${PORT}`);

    const cors = require('cors');
    const mongoose = require('mongoose');
    app.use(cors());
    app.use(express.json());

    const todoCreateRouter = require('./routes/todoCreate');
    const todoGetRouter = require('./routes/todoGet');
    const todoDeleteRouter = require('./routes/todoDelete');
    const todoUpdateRouter = require('./routes/todoUpdate');

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
  })
  .on('error', (err) => {
    console.error('[boot] listen 실패:', err.message);
    process.exit(1);
  });
