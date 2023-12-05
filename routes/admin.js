const express = require("express");
const router = express.Router();

router.get('/', (rep, res) => {
    res.render("admin/ControleEmpresa")
});

module.exports = router;