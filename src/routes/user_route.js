var express = require('express');
var router = express.Router()
const { check, validationResult } = require('express-validator');
const userHandler = require('../controllers/user')
const validator = require('../utils/validator');

router.post('/addUser', [
  check('email').not().isEmpty(),
  check('mobile').not().isEmpty(),
  check('user_name').not().isEmpty(),
  check('dob').not().isEmpty(),
],
 (req, res, next) => {
  validator(req, res, next)
},
  (req, res) => {
    userHandler.addUser(req, res)
  })

  router.get('/viewFilter',
  (req, res, next) => {

    validator(req, res, next)
  },
  (req, res) => {
    userHandler.viewFilter(req, res)
  })


module.exports = router;
