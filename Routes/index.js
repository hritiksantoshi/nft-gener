const router = require('express').Router();

router.use('/user',require('./UserRoutes'));

module.exports = router;