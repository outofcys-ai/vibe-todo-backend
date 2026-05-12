// 할일 삭제 라우터 — DELETE /api/todos/:id

const express = require('express');
const router = express.Router();
const Todo = require('../models/Todo');

router.delete('/:id', async (req, res) => {
  try {
    const todo = await Todo.findByIdAndDelete(req.params.id);

    if (!todo) {
      return res.status(404).json({ message: '할일을 찾을 수 없습니다.' });
    }

    res.status(200).json({ message: '삭제 완료' });
  } catch (err) {
    res.status(500).json({ message: '서버 오류', error: err.message });
  }
});

module.exports = router;
