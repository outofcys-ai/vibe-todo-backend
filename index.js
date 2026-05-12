// 진입점 파일 — Express 서버 실행 및 MongoDB 연결

const express = require('express');
const mongoose = require('mongoose');
const cors    = require('cors');
require('dotenv').config();

const todoCreateRouter = require('./routes/todoCreate');
const todoGetRouter = require('./routes/todoGet');
const todoDeleteRouter = require('./routes/todoDelete');
const todoUpdateRouter = require('./routes/todoUpdate');

const app = express();
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/todo-mogodb";

app.use(cors());
app.use(express.json());

// ✅ Health Check 엔드포인트 추가
app.get('/healthz', (req, res) => {
  res.send('ok');
});

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('데이터 베이스 연결성공');
    app.use('/api/todos', todoCreateRouter);
    app.use('/api/todos', todoGetRouter);
    app.use('/api/todos', todoDeleteRouter);
    app.use('/api/todos', todoUpdateRouter);
    app.listen(PORT, () => {
      console.log(`서버 실행 중: http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('MongoDB 연결 실패:', err.message);
  });
