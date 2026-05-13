// 진입점 파일 — Express 서버 실행 및 MongoDB 연결
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const todoCreateRouter = require('./routes/todoCreate');
const todoGetRouter = require('./routes/todoGet');
const todoDeleteRouter = require('./routes/todoDelete');
const todoUpdateRouter = require('./routes/todoUpdate');

const app = express();

// 환경변수 포트 설정
const rawPort = process.env.PORT;
const parsed = Number(rawPort);
const PORT =
  rawPort !== undefined && rawPort !== '' && Number.isFinite(parsed) && parsed > 0
    ? parsed
    : 3000;
const HOST = process.env.HOST || '0.0.0.0';
const MONGO_URI =
  process.env.MONGO_URI || 'mongodb://localhost:27017/todo-mogodb';

// 전역 미들웨어 설정
app.use(cors());
app.use(express.json());

// 헬스체크 라우트 (클라우드타입 startup / liveness probe 용도)
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

// API 라우트
app.use('/api/todos', todoCreateRouter);
app.use('/api/todos', todoGetRouter);
app.use('/api/todos', todoDeleteRouter);
app.use('/api/todos', todoUpdateRouter);

// DB 연결 후 서버 실행
mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('데이터 베이스 연결성공');
    app
      .listen(PORT, HOST, () => {
        console.log(`서버 실행 중: http://${HOST}:${PORT}`);
      })
      .on('error', (err) => {
        console.error('[boot] listen 실패:', err.message);
        process.exit(1);
      });
  })
  .catch((err) => {
    console.error('MongoDB 연결 실패:', err.message);
    // DB 연결 실패해도 건강상태 체크를 위해 서버는 올릴 수 있도록 처리
    app
      .listen(PORT, HOST, () => {
        console.log(`서버 실행 중 (DB 미연결): http://${HOST}:${PORT}`);
      });
  });
