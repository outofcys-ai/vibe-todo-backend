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

// 기본 라우트 (API 정보 제공)
app.get('/', (_req, res) => {
  res.status(200).json({
    name: 'vibe-todo-backend',
    todos: '/api/todos',
  });
});

// API 라우트
app.use('/api/todos', todoCreateRouter);
app.use('/api/todos', todoGetRouter);
app.use('/api/todos', todoDeleteRouter);
app.use('/api/todos', todoUpdateRouter);

// 서버를 먼저 실행하여 헬스체크 정상 응답을 보장
app.listen(PORT, HOST, () => {
  console.log(`서버 실행 중: http://${HOST}:${PORT}`);

  // 서버가 띄워진 후 DB 연결 시도
  mongoose
    .connect(MONGO_URI)
    .then(() => {
      console.log('데이터 베이스 연결성공');
    })
    .catch((err) => {
      console.error('MongoDB 연결 실패:', err.message);
    });
}).on('error', (err) => {
  console.error('[boot] listen 실패:', err.message);
  process.exit(1);
});
