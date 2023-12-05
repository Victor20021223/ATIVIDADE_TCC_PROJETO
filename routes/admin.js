const e = require("express");
const express = require("express");
const router = express.Router();

router.get('/', (rep, res) => {
    res.render("admin/ControleEmpresa")
});

e

module.exports = router;