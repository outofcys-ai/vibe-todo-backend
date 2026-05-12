// 할일 생성 라우터 — POST /api/todos

const express = require('express');
const router = express.Router();
const Todo = require('../models/Todo');

router.post('/', async (req, res) => {
  try {
    const { title } = req.body;

    if (!title) {
      return res.status(400).json({ message: '할일 내용을 입력해주세요.' });
    }

    const todo = await Todo.create({ title });
    res.status(201).json(todo);
  } catch (err) {
    res.status(500).json({ message: '서버 오류', error: err.message });
  }
});

module.exports = router;
