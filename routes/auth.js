const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.json({
    result:1,
    endpoint:'/auth'
  })
})

module.exports = router