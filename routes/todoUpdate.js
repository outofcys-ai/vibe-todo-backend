// 할일 수정 라우터 — PUT /api/todos/:id

const express = require('express');
const router = express.Router();
const Todo = require('../models/Todo');

router.put('/:id', async (req, res) => {
  try {
    const { title, completed } = req.body;

    const todo = await Todo.findByIdAndUpdate(
      req.params.id,
      { title, completed },
      { new: true, runValidators: true }
    );

    if (!todo) {
      return res.status(404).json({ message: '할일을 찾을 수 없습니다.' });
    }

    res.status(200).json(todo);
  } catch (err) {
    res.status(500).json({ message: '서버 오류', error: err.message });
  }
});

module.exports = router;
