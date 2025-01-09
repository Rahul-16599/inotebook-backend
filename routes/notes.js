const express = require("express");
const router = express.Router()

router.get('/', (req, res) => {
    obj = {
        name: "Rahul from notes",
        mono: "9511636032"
    }
    res.json(obj)
  })

module.exports = router